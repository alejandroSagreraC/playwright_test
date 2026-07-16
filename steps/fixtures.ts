import { test as base } from 'playwright-bdd';
import { APIRequestContext } from '@playwright/test';
import { LoginPage } from '../models/LoginPage';
import fs from 'node:fs/promises';
import path from 'node:path';

const JWT_STORAGE_KEY = 'jwtToken';
const STORAGE_STATE_PATH = path.resolve(__dirname, '..', 'playwright', '.auth', 'state.json');

type LocalStorageEntry = {
    name: string;
    value: string;
};

type StorageState = {
    origins?: Array<{
        origin: string;
        localStorage?: LocalStorageEntry[];
    }>;
};

function resolveCandidateOrigins(): string[] {
    const candidates = [process.env.API_URL, process.env.BASE_URL]
        .filter((value): value is string => Boolean(value))
        .map((value) => new URL(value).origin);

    return Array.from(new Set(candidates));
}

async function loadJwtTokenFromStorageState(): Promise<string> {
    const raw = await fs.readFile(STORAGE_STATE_PATH, 'utf-8');
    const storageState = JSON.parse(raw) as StorageState;
    const candidateOrigins = resolveCandidateOrigins();

    if (candidateOrigins.length === 0) {
        throw new Error('Set API_URL or BASE_URL to resolve jwtToken from storage state.');
    }

    for (const origin of candidateOrigins) {
        const stateForOrigin = storageState.origins?.find((entry) => entry.origin === origin);
        const tokenForOrigin = stateForOrigin?.localStorage?.find((entry) => entry.name === JWT_STORAGE_KEY)?.value;

        if (tokenForOrigin) {
            return tokenForOrigin;
        }
    }

    const fallbackToken = storageState.origins
        ?.flatMap((entry) => entry.localStorage ?? [])
        .find((entry) => entry.name === JWT_STORAGE_KEY)
        ?.value;

    if (fallbackToken) {
        return fallbackToken;
    }

    throw new Error(
        `jwtToken was not found in storage state for origins: ${candidateOrigins.join(', ')}. Run auth setup first.`
    );
}

type MyFixtures = {
    loginPage: LoginPage;
    apiClient: APIRequestContext;
};

export const test = base.extend<MyFixtures>({
    apiClient: async ({ playwright }, use) => {
        const jwtToken = await loadJwtTokenFromStorageState();
        const context = await playwright.request.newContext({
            baseURL: process.env.BASE_URL,
            extraHTTPHeaders: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`,
            }
        });
        await use(context);
        await context.dispose();
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    }
});

export { expect } from '@playwright/test';

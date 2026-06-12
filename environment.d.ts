declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BASE_URL: string;
      API_URL: string;
      CHECKIN_VISUAL_PAUSE_MS?: string;
      ADMIN_USER: string;
      ADMIN_PASS: string;
      ENV: 'qa' | 'stg' | 'prod';
    }
  }
}
export {};

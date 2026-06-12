# 1. Use the official Playwright image as the base
# It comes with all browsers (Chromium, Firefox, WebKit) and OS dependencies
FROM mcr.microsoft.com/playwright:v1.59.1-noble

# 2. Set the working directory
WORKDIR /app

# 3. Copy package files first (to leverage Docker layer caching)
COPY package*.json ./

# 4. Install dependencies 
# 'npm ci' ensures the exact versions from package-lock.json are installed
RUN npm ci

# 5. Copy the rest of your application code
COPY . .

# 6. Optional: Pre-generate BDD files to speed up container startup
# This runs 'bddgen' during the build process
RUN npx bddgen

# 7. Environment variable defaults (can be overridden at runtime)
ENV ENV=qa

# 8. Command to run tests
# We use 'sh -c' to allow environment variable expansion from Docker/Jenkins
CMD ["sh", "-c", "npx cross-env ENV=$ENV npx playwright test"]

declare namespace NodeJS {
    interface ProcessEnv {
        AUTH_ACCESS_TOKEN_SECRET_KEY: string;
        AUTH_REFRESH_TOKEN_SECRET_KEY: string;
        AUTH_ACCESS_TOKEN_EXPIRY: string;
        AUTH_REFRESH_TOKEN_EXPIRY: string;
    }
}

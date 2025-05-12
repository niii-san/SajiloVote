declare namespace NodeJS {
    interface ProcessEnv {
        PORT: number;
        CLIENT_URL: string;
        RUNTIME: "DEV" | "PROD";
        DATABASE_URL: string;

        AUTH_ACCESS_TOKEN_SECRET_KEY: string;
        AUTH_ACCESS_TOKEN_EXPIRY: string;
    }
}

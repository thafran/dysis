declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MODE: 'DEV' | 'PROD',
      DEBUG: string,
      PORT: string,
      MONGODB_URI: string,
      TOKEN_SECRET: string,
      ADMIN_USERNAME: string,
      ADMIN_PASSWORD: string,
      GOOGLE_API_KEY: string,
    }
  }
}

export {};

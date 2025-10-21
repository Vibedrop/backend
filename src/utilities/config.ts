const PROD_FRONTEND_URL = "https://incandescent-platypus-3fdb48.netlify.app";
const DEV_FRONTEND_URL = "http://localhost:3001"; // NextJS port

export const FRONTEND_URL =
    process.env.NODE_ENV === "production"
        ? PROD_FRONTEND_URL
        : DEV_FRONTEND_URL;

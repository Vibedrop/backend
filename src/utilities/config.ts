const PROD_FRONTEND_URL = "https://vibedrop-frontend.cc25.chasacademy.dev";
const DEV_FRONTEND_URL = "http://localhost:3001"; // NextJS port

export const FRONTEND_URL =
    process.env.NODE_ENV === "production"
        ? PROD_FRONTEND_URL
        : DEV_FRONTEND_URL;

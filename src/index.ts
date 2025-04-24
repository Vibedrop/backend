import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { FRONTEND_URL } from "./utilities/config";
import userRouter from "./routes/userRoutes";
import authRouter from "./routes/authRoutes";
import testRouter from "./routes/testRoutes";


const PORT = 3000;
const app = express();
const corsOptions = {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Required for Cookies
    optionsSuccessStatus: 200
};

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/test", testRouter);

app.get("/", (req, res) => {
    res.status(200).json({ status: "OK", message: `Env: ${process.env.NODE_ENV}` });
});

// Handle 404
const server = app.listen(PORT, error => {
    if (error) {
        console.log(Error);
    }

    console.log(`Server is running on ${JSON.stringify(server.address())}`);
});

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { FRONTEND_URL } from "./utilities/config";
import userRouter from "./routes/userRoutes";
import authRouter from "./routes/authRoutes";
import testRouter from "./routes/testRoutes";
import projectRouter from "./routes/projectRoutes";
import audioRouter from "./routes/audioRoutes";
import collaboratorRouter from "./routes/collaboratorRoutes";
import commentRouter from "./routes/commentRoutes";

const PORT = process.env.PORT || 3000;
const app = express();

// CORS middleware
app.use(
    cors({
        origin: FRONTEND_URL,           // frontend URL för prod/dev
        credentials: true,              // krävs för httponly-cookie
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        optionsSuccessStatus: 200,
    })
);

// JSON och cookie-parser middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/projects", projectRouter);
app.use("/audio", audioRouter);
app.use("/collaborators", collaboratorRouter);
app.use("/comments", commentRouter);

app.use("/test", testRouter);

// Healthcheck / root
app.get("/", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: `Env: ${process.env.NODE_ENV}`,
    });
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({
        status: "error",
        message: "Route not found",
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
});

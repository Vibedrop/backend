import express from "express";
import cors from "cors";
import userRouter from "./routes/userRoutes";
import authRouter from "./routes/authRoutes";

const app = express();
const port = 3000;
// Middleware
app.use(cors());
app.use(express.json());

app.use("/users", userRouter);
app.use("/auth", authRouter);

const server = app.listen(port, error => {
    if (error) {
        console.log(Error);
    }

    console.log(`Server is running on ${JSON.stringify(server.address())}`);
});


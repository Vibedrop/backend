import express from "express";
import cors from "cors";
import userRouter from "./routes/userRoutes";
import authRouter from "./routes/authRoutes";
import { prisma } from "./utilities/prisma";

const app = express();
const port = 3000;
// Middleware
app.use(cors());
app.use(express.json());

app.use("/users", userRouter);
//app.use("/auth", authRouter);

app.get("/prisma", async (req, res) => {
    const users = await prisma.user.findMany();

    res.status(200).json(users);
});

app.post("/prisma", async (req, res) => {
    const randomEmail =
        Math.random().toString(36).substring(2, 15) + "@example.com";
    const randomPassword = Math.random().toString(36).substring(2, 15);

    const user = await prisma.user.create({
        data: {
            email: randomEmail,
            password: randomPassword,
        },
    });
    res.status(201).json(user);
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
    });
});

const server = app.listen(port, error => {
    if (error) {
        console.log(Error);
    }

    console.log(`Server is running on ${JSON.stringify(server.address())}`);
});
import express from "express";
import cors from "cors";

const app = express();
const port = 3000;
// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Node.js and Express.js with TypeScript");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

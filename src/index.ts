import express from "express";
import cors from "cors";
import supabase from "./utilities/supabase";

const app = express();
const port = 3000;
// Middleware
app.use(cors());
app.use(express.json());

app.post("/", async (req, res) => {
  const file = req.body.files;
  try {
    console.log(file);
    // TODO: Replace wid nanoid
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 10);

    const { data, error } = await supabase.storage.from("vibe").upload(id, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type,
    });
  } catch (error) {
    console.error("Error creating user:", error);
  }
});

app.get("/", async (req, res) => {
  const { data, error } = await supabase.storage.from("vibe").list();
  if (error) return console.log(error);
  res.json({ data });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



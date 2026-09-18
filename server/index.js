import express from "express";
import cors from "cors";
import { getTranscript } from "./youtube.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/transcript", async (req, res) => {
  try {
    const { url, lang } = req.body || {};
    const result = await getTranscript(url, lang);
    res.json(result);
  } catch (err) {
    res.status(400).json({
      error: err.message || "Unable to fetch the transcript.",
    });
  }
});

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  console.log(`Transcript server running on http://localhost:${PORT}`);
});

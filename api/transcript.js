import { getTranscript } from "../server/youtube.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Only POST requests are supported." });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const { url, lang, translateTo } = body;
    const result = await getTranscript(url, lang, translateTo);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message || "Kuch galat ho gaya." });
  }
}
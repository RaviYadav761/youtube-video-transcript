import { fetchTranscript } from "youtube-transcript";

export function extractVideoId(input) {
  const value = String(input || "").trim();
  if (!value) return null;
  if (/^[\w-]{11}$/.test(value)) return value;

  let url;
  try {
    url = new URL(value.startsWith("http") ? value : `https://${value}`);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "");
  if (host === "youtu.be") {
    const id = url.pathname.slice(1).split("/")[0] || "";
    return /^[\w-]{11}$/.test(id) ? id : null;
  }
  if (!host.endsWith("youtube.com")) return null;

  const v = url.searchParams.get("v");
  if (v && /^[\w-]{11}$/.test(v)) return v;

  const parts = url.pathname.split("/").filter(Boolean);
  const marker = parts.findIndex((p) => ["shorts", "embed", "live", "v"].includes(p));
  const candidate = marker !== -1 ? parts[marker + 1] || "" : "";
  return /^[\w-]{11}$/.test(candidate) ? candidate : null;
}

export async function getTranscript(rawUrl, lang, translateTo) {
  const videoId = extractVideoId(rawUrl);
  if (!videoId) throw new Error("Please paste a valid YouTube video link.");
  const items = await fetchTranscript(videoId, lang ? { lang } : undefined);
  if (!items.length) throw new Error("This video does not have a transcript.");
  return {
    videoId,
    items,
    text: items.map((item) => item.text).join(" "),
  };
}

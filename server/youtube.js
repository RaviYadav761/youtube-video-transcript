const PLAYER_URL =
  "https://www.youtube.com/youtubei/v1/player?key=AIzaSyA8eiZmM1FaDVjRy-df2KTyQ_vz_yYM39w";

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

function decodeEntities(text) {
  return text
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function toParagraphs(lines) {
  const clean = lines
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter((l) => l.length > 0);
  const paragraphs = [];
  const CHUNK = 12;
  for (let i = 0; i < clean.length; i += CHUNK) {
    paragraphs.push(clean.slice(i, i + CHUNK).join(" "));
  }
  return paragraphs;
}

async function fetchPlayer(videoId) {
  const res = await fetch(PLAYER_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "user-agent":
        "com.google.android.youtube/20.10.38 (Linux; U; Android 11) gzip",
    },
    body: JSON.stringify({
      context: {
        client: {
          clientName: "ANDROID",
          clientVersion: "20.10.38",
          androidSdkVersion: 30,
          hl: "en",
        },
      },
      videoId,
    }),
  });
  if (!res.ok) throw new Error("YouTube se video ki jaankari nahi mili.");
  return await res.json();
}

async function fetchWatchPage(videoId) {
  const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36",
    },
  });
  if (!res.ok) throw new Error("YouTube se video ki jaankari nahi mili.");

  const html = await res.text();
  const marker = "var ytInitialPlayerResponse = ";
  const start = html.indexOf(marker);
  const end = html.indexOf(";</script>", start);
  if (start === -1 || end === -1) {
    throw new Error("YouTube se video ki jaankari nahi mili.");
  }

  return JSON.parse(html.slice(start + marker.length, end));
}

export async function getTranscript(rawUrl, lang, translateTo) {
  const videoId = extractVideoId(rawUrl);
  if (!videoId) throw new Error("Please paste a valid YouTube video link.");

  let data;
  try {
    data = await fetchPlayer(videoId);
  } catch {
    data = await fetchWatchPage(videoId);
  }
  const status = data?.playabilityStatus?.status;
  if (status && status !== "OK") {
    data = await fetchWatchPage(videoId);
    if (data?.playabilityStatus?.status && data.playabilityStatus.status !== "OK") {
      throw new Error(
        data?.playabilityStatus?.reason || "This video cannot be accessed.",
      );
    }
  }

  const details = data?.videoDetails || {};
  const renderer = data?.captions?.playerCaptionsTracklistRenderer;
  const tracks = renderer?.captionTracks || [];
  if (!tracks.length) {
    throw new Error("Is video par koi transcript / captions available nahi hai.");
  }

  const seen = new Set();
  const languages = [];
  for (const t of tracks) {
    if (seen.has(t.languageCode)) continue;
    seen.add(t.languageCode);
    languages.push({
      code: t.languageCode,
      name: t.name?.simpleText || t.name?.runs?.[0]?.text || t.languageCode,
    });
  }

  const translateLanguages = (renderer?.translationLanguages || []).map((t) => ({
    code: t.languageCode,
    name:
      t.languageName?.simpleText ||
      t.languageName?.runs?.[0]?.text ||
      t.languageCode,
  }));

  const track =
    tracks.find((t) => t.languageCode === lang) ||
    tracks.find((t) => t.kind !== "asr") ||
    tracks[0];

  let url = track.baseUrl;
  if (translateTo) url += `&tlang=${encodeURIComponent(translateTo)}`;

  const capRes = await fetch(url);
  if (!capRes.ok) throw new Error("Transcript download nahi ho paaya.");
  const xml = await capRes.text();

  const lines = [
    ...xml.matchAll(/<(?:p|text)\b[^>]*>([\s\S]*?)<\/(?:p|text)>/g),
  ].map((m) => decodeEntities((m[1] || "").replace(/<[^>]+>/g, " ")));

  const paragraphs = toParagraphs(lines);
  if (!paragraphs.length) throw new Error("Transcript khaali mila.");

  const thumbs = details?.thumbnail?.thumbnails || [];
  const thumbnail =
    thumbs[thumbs.length - 1]?.url ||
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  return {
    videoId,
    title: details.title || "YouTube video",
    author: details.author || "Unknown",
    thumbnail,
    paragraphs,
    languages,
    translateLanguages,
    language: translateTo || track.languageCode,
  };
}

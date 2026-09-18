import { useState } from "react";
import { AlertCircle } from "lucide-react";
import UrlSearchBar from "./components/UrlSearchBar.jsx";
import VideoMeta from "./components/VideoMeta.jsx";
import TranscriptCard from "./components/TranscriptCard.jsx";

export default function App() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);

  async function load(targetUrl, translateTo) {
    const isTranslate = Boolean(translateTo);
    setError("");
    if (isTranslate) setTranslating(true);
    else setLoading(true);

    try {
      const res = await fetch("/api/transcript", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: targetUrl, translateTo }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Transcript nahi mila.");
      setData(json);
    } catch (err) {
      setError(err.message);
      if (!isTranslate) setData(null);
    } finally {
      setLoading(false);
      setTranslating(false);
    }
  }

  return (
    <main className="brand-gradient min-h-screen px-4 py-6">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <UrlSearchBar
          onSubmit={(value) => {
            setUrl(value);
            load(value);
          }}
          loading={loading}
        />

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-surface px-4 py-3 text-sm text-danger shadow-sm">
            <AlertCircle className="size-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {data && (
          <>
            <VideoMeta title={data.title} author={data.author} videoId={data.videoId} />
            <TranscriptCard
              videoId={data.videoId}
              title={data.title}
              author={data.author}
              thumbnail={data.thumbnail}
              paragraphs={data.paragraphs}
              translateLanguages={data.translateLanguages}
              language={data.language}
              translating={translating}
              onTranslate={(code) => load(url, code)}
            />
          </>
        )}

        {!data && !loading && (
          <p className="pt-10 text-center text-brand-foreground/90">
            Paste a YouTube video link above to get its full transcript — free, instant,
            copyable and translatable.
          </p>
        )}
      </div>
    </main>
  );
}

import { useMemo, useState } from "react";
import {
  AlertCircle,
  Check,
  Clipboard,
  Download,
  FileText,
  Link,
  LoaderCircle,
  Sparkles,
} from "lucide-react";

function formatTime(seconds) {
  const totalSeconds = Math.max(0, Math.floor(Number(seconds) || 0));
  const minutes = Math.floor(totalSeconds / 60);
  const remaining = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${remaining}`;
}

export default function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const transcriptText = useMemo(
    () => result?.text || result?.items?.map((item) => item.text).join(" ") || "",
    [result],
  );

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setResult(null);
    setCopied(false);
    if (!url.trim()) {
      setError("Please paste a YouTube video URL.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/transcript", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error(
          "The API endpoint is not available. Redeploy the latest version and try again.",
        );
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Transcript fetch nahi ho paaya.");
      setResult(data);
    } catch (requestError) {
      setError(requestError.message || "Transcript fetch nahi ho paaya.");
    } finally {
      setLoading(false);
    }
  }

  async function copyTranscript() {
    await navigator.clipboard.writeText(transcriptText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function downloadTranscript() {
    const blob = new Blob([transcriptText], { type: "text/plain;charset=utf-8" });
    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = downloadUrl;
    anchor.download = `youtube-transcript-${result.videoId}.txt`;
    anchor.click();
    URL.revokeObjectURL(downloadUrl);
  }

  return (
    <main className="min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col">
        <header className="flex items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-3">
            <div className="logo-mark"><FileText size={20} /></div>
            <span className="font-display text-sm font-bold tracking-[0.16em] text-white uppercase">Transcript Lab</span>
          </div>
          <span className="hidden rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80 sm:block">Runs locally on your machine</span>
        </header>

        <section className="hero-grid flex flex-1 flex-col items-center justify-center py-14 text-center">
          <div className="eyebrow"><Sparkles size={14} /> SIMPLE. PRIVATE. LOCAL.</div>
          <h1 className="mt-6 max-w-4xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">YouTube Transcript<span className="block text-amber-300">Generator</span></h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-indigo-100 sm:text-lg">Turn any YouTube video into clean, readable text in seconds. Your link stays on this local app.</p>

          <form onSubmit={handleSubmit} className="search-panel mt-10 w-full max-w-4xl">
            <div className="relative flex flex-1 items-center">
              <Link className="absolute left-4 text-indigo-400" size={20} />
              <input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Paste a YouTube URL..." aria-label="YouTube video URL" className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-300/20 sm:text-base" />
            </div>
            <button type="submit" disabled={loading} className="cta-button">
              {loading ? <LoaderCircle className="animate-spin" size={19} /> : <Sparkles size={19} />}
              {loading ? "Fetching..." : "Get Free Transcript"}
            </button>
          </form>

          {error && <div className="alert-box mt-5 w-full max-w-4xl" role="alert"><AlertCircle size={19} /><span>{error}</span></div>}
        </section>

        {result && <section className="result-panel mb-8 w-full" aria-live="polite">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-indigo-500 uppercase"><Check size={16} /> Transcript ready</div>
              <h2 className="mt-2 font-display text-xl font-bold text-slate-900">Video {result.videoId}</h2>
              <p className="mt-1 text-sm text-slate-500">{result.items.length} transcript segments</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={copyTranscript} className="secondary-button">{copied ? <Check size={17} /> : <Clipboard size={17} />}{copied ? "Copied" : "Copy"}</button>
              <button type="button" onClick={downloadTranscript} className="secondary-button"><Download size={17} /> Download TXT</button>
            </div>
          </div>
          <div className="transcript-scroll px-5 py-5 sm:px-7">
            {result.items.map((item, index) => <div className="transcript-row" key={`${item.offset}-${index}`}><span className="time-stamp">{formatTime(item.offset)}</span><p>{item.text}</p></div>)}
          </div>
        </section>}

        {!result && !loading && !error && <div className="feature-strip mx-auto mb-8 grid w-full max-w-3xl grid-cols-1 gap-3 text-left sm:grid-cols-3"><div><strong>01</strong><span>Paste your link</span></div><div><strong>02</strong><span>Fetch the captions</span></div><div><strong>03</strong><span>Copy or download</span></div></div>}
      </div>
    </main>
  );
}

import { useEffect, useState } from "react";
import { ArrowUp, Check, Copy, Languages, Loader2 } from "lucide-react";
import ActionButton from "./ActionButton.jsx";
import VideoPreview from "./VideoPreview.jsx";

export default function TranscriptCard({
  videoId,
  title,
  author,
  thumbnail,
  paragraphs,
  translateLanguages = [],
  language,
  translating,
  onTranslate,
}) {
  const [copied, setCopied] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  async function copyAll() {
    await navigator.clipboard.writeText(paragraphs.join("\n\n"));
    setCopied(true);
  }

  return (
    <section className="rounded-2xl bg-surface-muted p-4 shadow-panel sm:p-6">
      <h2 className="mb-4 text-xl font-bold text-ink">Transcript</h2>

      <VideoPreview
        videoId={videoId}
        title={title}
        author={author}
        thumbnail={thumbnail}
      />

      <div className="mt-4 space-y-3">
        <ActionButton variant="copy" onClick={copyAll}>
          {copied ? <Check className="size-5" /> : <Copy className="size-5" />}
          {copied ? "Copied!" : "Copy"}
        </ActionButton>

        <ActionButton
          variant="outline"
          onClick={() => setPickerOpen((v) => !v)}
          disabled={translating || translateLanguages.length === 0}
        >
          {translating ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Languages className="size-5" />
          )}
          {translating ? "Translating..." : "Translate"}
        </ActionButton>

        {pickerOpen && translateLanguages.length > 0 && (
          <select
            aria-label="Translate transcript to"
            value={language}
            onChange={(e) => {
              onTranslate(e.target.value);
              setPickerOpen(false);
            }}
            className="w-full rounded-xl border-2 border-cta bg-surface px-4 py-3 text-base text-ink outline-none"
          >
            {translateLanguages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <article className="mt-4 space-y-4 rounded-xl bg-surface p-4 text-[15px] leading-relaxed text-ink sm:p-5">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </article>

      <ActionButton
        variant="ghost"
        className="mt-4"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp className="size-5" /> Back to Top
      </ActionButton>
    </section>
  );
}

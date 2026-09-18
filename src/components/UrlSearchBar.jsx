import { useState } from "react";
import { Loader2 } from "lucide-react";
import ActionButton from "./ActionButton.jsx";

export default function UrlSearchBar({ onSubmit, loading, initialValue = "" }) {
  const [value, setValue] = useState(initialValue);

  function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim() || loading) return;
    onSubmit(value.trim());
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-3 rounded-2xl border border-white/30 bg-white/15 p-3 shadow-panel backdrop-blur-sm sm:flex-row sm:items-center"
    >
      <input
        type="text"
        inputMode="url"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Paste YouTube URL here..."
        aria-label="YouTube video URL"
        className="min-w-0 flex-1 rounded-xl bg-surface px-5 py-4 text-base text-ink shadow-sm outline-none placeholder:text-ink-muted focus-visible:ring-2 focus-visible:ring-cta"
      />
      <ActionButton type="submit" full={false} disabled={loading} className="px-7 py-4">
        {loading ? <Loader2 className="size-5 animate-spin" /> : null}
        {loading ? "Fetching..." : "Get Free Transcript"}
      </ActionButton>
    </form>
  );
}

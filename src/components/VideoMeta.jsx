import { Share2, ThumbsUp, UserPlus } from "lucide-react";

export default function VideoMeta({ title, author, videoId }) {
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: watchUrl });
        return;
      } catch {
        /* user cancelled */
      }
    }
    await navigator.clipboard.writeText(watchUrl);
  }

  return (
    <header className="text-center text-brand-foreground">
      <h1 className="text-2xl font-bold sm:text-3xl">Transcript of {title}</h1>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-brand-foreground/90">
        <span>Author : {author}</span>
        <span aria-hidden>•</span>
        <a
          href={watchUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 hover:underline"
        >
          <ThumbsUp className="size-4" /> Like
        </a>
        <span aria-hidden>•</span>
        <a
          href={watchUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 hover:underline"
        >
          <UserPlus className="size-4" /> Subscribe
        </a>
        <span aria-hidden>•</span>
        <button onClick={share} className="inline-flex items-center gap-1 hover:underline">
          <Share2 className="size-4" /> Share
        </button>
      </div>
    </header>
  );
}

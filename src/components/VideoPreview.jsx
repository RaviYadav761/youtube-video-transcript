import { useState } from "react";
import { Play } from "lucide-react";

export default function VideoPreview({ videoId, title, author, thumbnail }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
        <iframe
          className="size-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      className="group relative aspect-video w-full overflow-hidden rounded-xl bg-black"
      aria-label={`Play ${title}`}
    >
      <img src={thumbnail} alt={title} className="size-full object-cover" />
      <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-danger transition-transform group-hover:scale-110">
          <Play className="size-8 fill-current text-brand-foreground" />
        </span>
      </span>
      <span className="absolute inset-x-3 bottom-3 text-left text-brand-foreground">
        <span className="block text-sm font-semibold">{author}</span>
        <span className="block truncate text-sm">{title}</span>
      </span>
    </button>
  );
}

const VARIANTS = {
  cta: "bg-cta text-cta-foreground shadow-md hover:bg-cta-hover focus-visible:ring-cta",
  copy: "bg-copy text-brand-foreground shadow-sm hover:bg-copy-hover focus-visible:ring-copy",
  outline: "border-2 border-cta bg-surface text-cta hover:bg-cta/10 focus-visible:ring-cta",
  ghost:
    "border border-brand-soft bg-brand-soft/30 text-brand-deep hover:bg-brand-soft/50 focus-visible:ring-brand",
};

export default function ActionButton({
  variant = "cta",
  full = true,
  className = "",
  children,
  ...rest
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-base font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

  return (
    <button
      className={`${base} ${full ? "w-full" : "w-auto"} ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

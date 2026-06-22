export function Spinner({ label = 'Loading' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-slate">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-evergreen" />
      <span className="text-sm">{label}…</span>
    </div>
  );
}

export function ErrorNote({ children }) {
  return (
    <div className="rounded-lg border border-amber-600/40 bg-amber/10 px-4 py-3 text-sm text-ink">
      {children}
    </div>
  );
}

export function EmptyState({ title, hint }) {
  return (
    <div className="rounded-xl border border-dashed border-line bg-surface px-6 py-14 text-center">
      <p className="font-display text-lg text-ink">{title}</p>
      {hint && <p className="mt-1 text-sm text-slate">{hint}</p>}
    </div>
  );
}

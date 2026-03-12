export default function AccountLoading() {
  return (
    <div className="animate-pulse space-y-4 rounded-2xl border bg-card p-6">
      <div className="h-6 w-48 bg-muted rounded" />
      <div className="h-4 w-full max-w-xl bg-muted rounded" />
      <div className="h-4 w-full max-w-lg bg-muted rounded mt-2" />
      <div className="h-px bg-border my-6" />
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 w-full bg-muted rounded-xl" />
        ))}
      </div>
    </div>
  );
}

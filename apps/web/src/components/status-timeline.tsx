export function StatusTimeline({ steps }: { steps: string[] }) {
  return (
    <div className="rounded-3xl border border-line bg-white p-5">
      <h2 className="text-lg font-semibold text-ink">Milestone path</h2>
      <div className="mt-5 space-y-4">
        {steps.map((step, index) => (
          <div key={step} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="grid h-7 w-7 place-items-center rounded-full border border-line bg-surface text-xs font-semibold text-ink">{index + 1}</div>
              {index < steps.length - 1 ? <div className="h-8 w-px bg-line" /> : null}
            </div>
            <p className="pt-1 text-sm text-muted">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

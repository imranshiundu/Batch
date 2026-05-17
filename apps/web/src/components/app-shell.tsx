import Link from "next/link";

const nav = [
  ["Home", "/app"],
  ["Live batches", "/batches"],
  ["My deals", "/app/my-batches"],
  ["Wallet", "/app/wallet"],
  ["Supplier", "/supplier"],
  ["Admin", "/admin"],
];

export function AppShell({ children, title, eyebrow }: { children: React.ReactNode; title: string; eyebrow?: string }) {
  return (
    <main className="min-h-screen bg-surface">
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-line bg-white p-6 lg:block">
        <Link href="/" className="text-xl font-semibold tracking-tight text-ink">Batch</Link>
        <p className="mt-2 text-sm text-muted">Deal-clearing app</p>
        <nav className="mt-8 space-y-1">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="block rounded-2xl px-4 py-3 text-sm text-muted transition hover:bg-surface hover:text-ink">
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <section className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-line bg-white/90 px-5 py-4 backdrop-blur md:px-8">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <div>
              {eyebrow ? <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">{eyebrow}</p> : null}
              <h1 className="text-xl font-semibold text-ink md:text-2xl">{title}</h1>
            </div>
            <Link href="/batches" className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white">Commit</Link>
          </div>
        </header>
        <div className="mx-auto max-w-6xl px-5 py-6 md:px-8 md:py-10">{children}</div>
      </section>
    </main>
  );
}

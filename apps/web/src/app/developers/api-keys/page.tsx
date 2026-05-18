import { AppShell } from "@/components/app-shell";
import { apiRoutes } from "@/lib/api/client";

const scopes = [
  "market:read",
  "market:depth:read",
  "orders:create",
  "orders:cancel",
  "slots:read",
  "slots:listings:create",
  "slots:listings:purchase",
  "slots:pnl:read",
  "delivery:read",
  "delivery:write",
];

const routes = [
  ["GET", apiRoutes.developerApiKeys, "List API keys without raw secrets"],
  ["POST", apiRoutes.developerApiKeys, "Create API key and show raw secret once"],
  ["POST", "/api/developers/api-keys/:keyId/revoke", "Revoke API key"],
  ["GET", apiRoutes.developerManifest, "Read bot rules and scopes"],
];

export default function DeveloperApiKeysPage() {
  return (
    <AppShell title="API keys" eyebrow="Developer controls">
      <section className="rounded-3xl border border-line bg-white p-5">
        <h2 className="text-xl font-semibold text-ink">Controlled bot access</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
          API keys let a user connect a bot to Batch without giving it platform control. Keys are scoped. A bot can read markets or create orders only if the key allows that action.
        </p>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-line bg-white p-5">
          <h3 className="font-semibold text-ink">Available scopes</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {scopes.map((scope) => (
              <span key={scope} className="rounded-full bg-surface px-3 py-2 font-mono text-xs text-muted">{scope}</span>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-line bg-white p-5">
          <h3 className="font-semibold text-ink">Rules</h3>
          <p className="mt-2 text-sm leading-6 text-muted">
            Raw keys are shown once. Stored keys are hashed. Revoked, expired, or underscoped keys cannot call protected bot routes in database mode.
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-line bg-white p-5">
        <h3 className="font-semibold text-ink">API connection points</h3>
        <div className="mt-4 grid gap-3">
          {routes.map(([method, path, purpose]) => (
            <div key={`${method}-${path}`} className="grid gap-2 rounded-2xl bg-surface p-4 md:grid-cols-[90px_1fr_1.2fr]">
              <span className="font-mono text-xs font-semibold text-ink">{method}</span>
              <span className="font-mono text-xs text-muted">{path}</span>
              <span className="text-sm text-muted">{purpose}</span>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

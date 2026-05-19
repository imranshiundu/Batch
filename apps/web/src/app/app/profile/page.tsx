"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code2, Edit2, Lock, LogOut, ShieldCheck, Trash2 } from "lucide-react";
import { batchApi } from "@/lib/api/client";
import { EmptyState, ErrorState, LoadingState, readArray, readText, Surface, type JsonRecord } from "@/components/ui/data-state";

export default function ProfilePage() {
  const [profiles, setProfiles] = React.useState<JsonRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    batchApi.listDeliveryProfiles()
      .then((result) => {
        if (!mounted) return;
        if (!result.ok) return setError(result.error?.message ?? "Delivery profiles endpoint returned an error.");
        setProfiles(readArray<JsonRecord>(result.data, ["profiles", "items", "data"]));
      })
      .catch((err: Error) => mounted && setError(err.message))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-8 pb-12">
      <section className="overflow-hidden rounded-[28px] border border-black/10 bg-black text-white shadow-2xl shadow-black/10">
        <div className="grid gap-8 p-6 md:grid-cols-[1fr_auto] md:p-8">
          <div className="flex items-center gap-5">
            <div className="flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-[28px] bg-white text-[30px] font-bold text-black">BA</div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50">Unified account</p>
              <h1 className="mt-2 text-[32px] font-semibold tracking-[-0.04em]">Batch Account</h1>
              <div className="mt-3 flex flex-wrap items-center gap-2"><Badge variant="success">Verified</Badge><Badge variant="neutral">Buyer + Batch Creator</Badge><Badge variant="default">Developer Ready</Badge></div>
            </div>
          </div>
          <div className="flex items-start md:justify-end"><Button variant="secondary" className="bg-white text-black hover:bg-white/90">Edit Profile</Button></div>
        </div>
      </section>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[360px_1fr]">
        <div className="flex flex-col gap-6">
          <Surface className="p-6">
            <h2 className="text-[16px] font-semibold text-ink-primary">Identity</h2>
            <div className="mt-5 space-y-5">
              <Field label="Email" value="Locked after verification" locked />
              <Field label="Display Name" value="Batch Account" />
              <Field label="Account access" value="Can discover, commit, create batches, use developer tools" />
            </div>
          </Surface>

          <Surface className="p-6">
            <div className="flex items-center justify-between gap-3"><h2 className="text-[16px] font-semibold text-ink-primary">Delivery Profiles</h2><Button variant="ghost" size="sm">Add Address</Button></div>
            <div className="mt-5">
              {loading ? <LoadingState rows={2} /> : null}
              {error ? <ErrorState message={error} /> : null}
              {!loading && !error && profiles.length === 0 ? <EmptyState title="No delivery profiles." copy="Create one before final delivery routing. No placeholder addresses are shown." /> : null}
              {!loading && !error && profiles.map((profile) => <DeliveryProfileRow key={readText(profile, ["id", "profileId"])} profile={profile} />)}
            </div>
          </Surface>
        </div>

        <div className="flex flex-col gap-6">
          <Surface className="p-6">
            <h2 className="text-[16px] font-semibold text-ink-primary">Account capabilities</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <Capability title="Create product batches" copy="Any verified product owner can submit batches from the same app account." />
              <Capability title="Commit to other batches" copy="The same account can reserve allocation in public batches." />
              <Capability title="Developer portal" copy="API access is linked to the profile, not a separate account type." icon="code" />
              <Capability title="Operator isolation" copy="Operator console remains separated from marketplace accounts." icon="shield" />
            </div>
          </Surface>

          <Surface className="p-6">
            <h2 className="mb-4 text-[16px] font-semibold text-ink-primary">Notifications</h2>
            <ToggleRow title="Milestone Updates" copy="Receive alerts when batches progress." checked />
            <ToggleRow title="Escrow Alerts" copy="Critical locks and releases." checked />
            <ToggleRow title="Refund Notifications" copy="Alerts for failed batches." checked />
          </Surface>

          <Surface className="p-6">
            <h2 className="mb-1 text-[16px] font-semibold text-ink-primary">Developer API Keys</h2>
            <p className="mb-4 text-[13px] leading-6 text-ink-secondary">API key creation and revocation lives in the developer portal and is available to this same account.</p>
            <Link href="/developers/api-keys"><Button variant="secondary"><Code2 className="mr-2 h-4 w-4" />Open Developer Portal</Button></Link>
          </Surface>

          <button className="mt-2 flex h-[48px] w-full items-center justify-center gap-2 rounded-2xl border border-[#FECACA] bg-white text-[14px] font-semibold text-[#DC2626] transition-colors hover:bg-[#FEF2F2]"><LogOut className="h-4 w-4" />Log Out</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, locked = false }: { label: string; value: string; locked?: boolean }) {
  return <div className="flex flex-col gap-1"><span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-secondary">{label}</span><span className="flex items-center gap-2 text-[14px] leading-6 text-ink-primary">{value}{locked ? <Lock className="h-3 w-3 text-ink-secondary" /> : null}</span></div>;
}

function Capability({ title, copy, icon = "shield" }: { title: string; copy: string; icon?: "shield" | "code" }) {
  const Icon = icon === "code" ? Code2 : ShieldCheck;
  return <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4"><Icon className="mb-4 h-5 w-5 text-ink-primary" strokeWidth={1.7} /><p className="text-[14px] font-semibold text-ink-primary">{title}</p><p className="mt-2 text-[13px] leading-5 text-ink-secondary">{copy}</p></div>;
}

function DeliveryProfileRow({ profile }: { profile: JsonRecord }) {
  const locked = Boolean(profile.locked || profile.lockedAt || profile.deliveryLockAt);
  return <div className="flex items-start justify-between border-b border-surface-raised py-4 first:pt-0 last:border-0"><div className="flex items-start gap-3"><input type="radio" checked={Boolean(profile.isDefault || profile.default)} readOnly className="mt-1 text-semantic-escrow" /><div><span className="text-[14px] font-medium text-ink-primary">{readText(profile, ["label", "name"], "Delivery profile")}</span><span className="mt-1 block text-[13px] text-ink-secondary">{readText(profile, ["recipientName"], "Recipient pending")} · {readText(profile, ["phone"], "Phone pending")}</span><span className="mt-1 block text-[13px] text-ink-secondary">{readText(profile, ["address", "addressLine", "hubCode"], "Address pending")}, {readText(profile, ["city", "country"], "")}</span>{locked ? <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-semantic-warningLight px-2 py-1 text-[11px] font-medium text-semantic-warning"><Lock className="h-3 w-3" /> Locked by delivery batch</span> : null}</div></div><div className="flex items-center gap-2 text-ink-secondary"><button className="hover:text-ink-primary" disabled={locked}><Edit2 className="h-4 w-4" /></button><button className="hover:text-semantic-warning" disabled={locked}><Trash2 className="h-4 w-4" /></button></div></div>;
}

function ToggleRow({ title, copy, checked }: { title: string; copy: string; checked: boolean }) {
  return <div className="flex items-center justify-between border-b border-surface-raised py-4 last:border-0"><div><span className="text-[15px] font-medium text-ink-primary">{title}</span><span className="block text-[13px] text-ink-secondary">{copy}</span></div><div className={`h-[20px] w-[36px] rounded-full p-[2px] transition-colors ${checked ? "bg-brand-action" : "border border-line bg-surface-raised"}`}><div className={`h-[16px] w-[16px] rounded-full bg-white transition-transform ${checked ? "translate-x-[16px]" : "translate-x-0"}`} /></div></div>;
}

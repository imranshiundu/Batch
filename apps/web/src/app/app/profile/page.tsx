"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Lock, LogOut, Trash2 } from "lucide-react";
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
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 pb-12">
      <div className="flex items-start justify-between border-b border-line pb-8">
        <div className="flex items-center gap-6">
          <div className="flex h-[80px] w-[80px] shrink-0 items-center justify-center rounded-full bg-surface-raised font-display text-[28px] font-bold text-ink-primary">BA</div>
          <div className="flex flex-col items-start gap-2"><h2 className="text-[28px] font-medium leading-none tracking-tight text-ink-primary">Batch Buyer</h2><div className="flex items-center gap-2"><Badge variant="default">Buyer</Badge><Badge variant="success">Verified</Badge></div></div>
        </div>
        <Button variant="ghost" className="h-[36px]">Edit Profile</Button>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[320px_1fr]">
        <div className="flex flex-col gap-6">
          <Surface className="flex flex-col gap-4 p-6"><h3 className="text-[16px] font-medium text-ink-primary">Personal Information</h3><Field label="Email" value="Locked after verification" locked /><Field label="Display Name" value="Batch Buyer" /></Surface>
          <Surface className="flex flex-col gap-4 p-6"><div className="flex items-center justify-between"><h3 className="text-[16px] font-medium text-ink-primary">Delivery Profiles</h3><Button variant="ghost" size="sm">Add Address</Button></div>{loading ? <LoadingState rows={2} /> : null}{error ? <ErrorState message={error} /> : null}{!loading && !error && profiles.length === 0 ? <EmptyState title="No delivery profiles." copy="Create one with POST /api/profile/delivery before final delivery routing." /> : null}{!loading && !error && profiles.map((profile) => <DeliveryProfileRow key={readText(profile, ["id", "profileId"])} profile={profile} />)}</Surface>
        </div>

        <div className="flex flex-col gap-6">
          <Surface className="p-6"><h3 className="mb-4 text-[16px] font-medium text-ink-primary">Notifications</h3><ToggleRow title="Milestone Updates" copy="Receive alerts when batches progress." checked /><ToggleRow title="Escrow Alerts" copy="Critical locks and releases." checked /><ToggleRow title="Refund Notifications" copy="Alerts for failed batches." checked /></Surface>
          <Surface className="p-6"><h3 className="mb-1 text-[16px] font-medium text-ink-primary">Developer API Keys</h3><p className="mb-4 text-[13px] text-ink-secondary">API key creation and revocation lives in the dedicated developer portal.</p><Link href="/developers/api-keys"><Button variant="secondary">Open API Keys</Button></Link></Surface>
          <button className="mt-4 flex h-[44px] w-full items-center justify-center gap-2 rounded-full border border-[#FECACA] text-[14px] font-medium text-[#DC2626] transition-colors hover:bg-[#FEF2F2]"><LogOut className="h-4 w-4" />Log Out</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, locked = false }: { label: string; value: string; locked?: boolean }) {
  return <div className="flex flex-col gap-1"><span className="text-[12px] uppercase tracking-wide text-ink-secondary">{label}</span><span className="flex items-center gap-2 text-[14px] text-ink-primary">{value}{locked ? <Lock className="h-3 w-3 text-ink-secondary" /> : null}</span></div>;
}

function DeliveryProfileRow({ profile }: { profile: JsonRecord }) {
  const locked = Boolean(profile.locked || profile.lockedAt || profile.deliveryLockAt);
  return <div className="flex items-start justify-between border-b border-surface-raised pb-4 last:border-0"><div className="flex items-start gap-3"><input type="radio" checked={Boolean(profile.isDefault || profile.default)} readOnly className="mt-1 text-semantic-escrow" /><div><span className="text-[14px] font-medium text-ink-primary">{readText(profile, ["label", "name"], "Delivery profile")}</span><span className="mt-1 block text-[13px] text-ink-secondary">{readText(profile, ["recipientName"], "Recipient pending")} · {readText(profile, ["phone"], "Phone pending")}</span><span className="mt-1 block text-[13px] text-ink-secondary">{readText(profile, ["address", "addressLine", "hubCode"], "Address pending")}, {readText(profile, ["city", "country"], "")}</span>{locked ? <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-semantic-warningLight px-2 py-1 text-[11px] font-medium text-semantic-warning"><Lock className="h-3 w-3" /> Locked by delivery batch</span> : null}</div></div><div className="flex items-center gap-2 text-ink-secondary"><button className="hover:text-ink-primary" disabled={locked}><Edit2 className="h-4 w-4" /></button><button className="hover:text-semantic-warning" disabled={locked}><Trash2 className="h-4 w-4" /></button></div></div>;
}

function ToggleRow({ title, copy, checked }: { title: string; copy: string; checked: boolean }) {
  return <div className="flex items-center justify-between border-b border-surface-raised py-4 last:border-0"><div><span className="text-[15px] font-medium text-ink-primary">{title}</span><span className="block text-[13px] text-ink-secondary">{copy}</span></div><div className={`h-[20px] w-[36px] rounded-full p-[2px] transition-colors ${checked ? "bg-brand-action" : "border border-line bg-surface-raised"}`}><div className={`h-[16px] w-[16px] rounded-full bg-white transition-transform ${checked ? "translate-x-[16px]" : "translate-x-0"}`} /></div></div>;
}

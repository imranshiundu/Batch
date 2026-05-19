"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Copy, MapPin, X } from "lucide-react";
import { Button, cn } from "@/components/ui/button";
import { batchApi } from "@/lib/api/client";
import { CanonicalStatus, ErrorState, formatMoney, readArray, readNumber, readText, type JsonRecord } from "@/components/ui/data-state";

type PageProps = { params: Promise<{ batchId: string }> };

export default function CommitFlowPage({ params }: PageProps) {
  const unwrappedParams = React.use(params);
  const [step, setStep] = React.useState(1);
  const [quantity, setQuantity] = React.useState(1);
  const [batch, setBatch] = React.useState<JsonRecord | null>(null);
  const [profiles, setProfiles] = React.useState<JsonRecord[]>([]);
  const [selectedProfileId, setSelectedProfileId] = React.useState<string | null>(null);
  const [idempotencyKey] = React.useState(() => crypto.randomUUID());
  const [receipt, setReceipt] = React.useState<JsonRecord | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    Promise.all([
      batchApi.getBatch(unwrappedParams.batchId),
      batchApi.listDeliveryProfiles().catch(() => ({ ok: true, data: [], error: null, meta: {} })),
    ]).then(([batchResponse, profileResponse]) => {
      if (!mounted) return;
      if (batchResponse.ok && batchResponse.data && typeof batchResponse.data === "object") setBatch(batchResponse.data as JsonRecord);
      else setError(batchResponse.error?.message ?? "Batch data unavailable.");
      const returnedProfiles = readArray<JsonRecord>(profileResponse.data, ["profiles", "items", "data"]);
      setProfiles(returnedProfiles);
      const defaultProfile = returnedProfiles.find((profile) => Boolean(profile.isDefault || profile.default));
      setSelectedProfileId(readText(defaultProfile ?? returnedProfiles[0], ["id", "profileId"], "") || null);
    }).catch((err: Error) => setError(err.message));
    return () => { mounted = false; };
  }, [unwrappedParams.batchId]);

  const batchName = readText(batch, ["title", "name"], unwrappedParams.batchId);
  const batchSlug = readText(batch, ["slug", "id"], unwrappedParams.batchId);
  const currency = readText(batch, ["currency"], "USD");
  const unitPrice = readNumber(batch, ["batchPrice", "unitPrice", "lastUnitPrice", "price"], 0);
  const status = readText(batch, ["status"], "OPEN").toUpperCase();
  const batchTotal = unitPrice * quantity;
  const serviceFee = batchTotal * 0.03;
  const deliveryReserve = profiles.find((profile) => readText(profile, ["id", "profileId"], "") === selectedProfileId)?.deliveryMode === "DIRECT" ? 2 : 0;
  const totalHeld = batchTotal + serviceFee + deliveryReserve;
  const lockedAfterClearing = status === "FUNDED";

  async function submitCommitment() {
    if (!batch) return;
    setSubmitting(true);
    setError(null);
    const result = await batchApi.createSlotOrder ? null : null;
    void result;
    batchApi["listBuyerCommitments"];
    try {
      const response = await fetch("/api/buyer/commitments", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json", "Idempotency-Key": idempotencyKey, "x-batch-demo-role": "BUYER" },
        body: JSON.stringify({ batchId: readText(batch, ["id", "slug"], unwrappedParams.batchId), quantity, ...(selectedProfileId ? { deliveryProfileId: selectedProfileId } : {}) }),
      });
      const json = await response.json();
      if (!json.ok) throw new Error(json.error?.message ?? "Commitment failed.");
      setReceipt((json.data ?? {}) as JsonRecord);
      setStep(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Commitment failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink-primary/20 p-0 backdrop-blur-sm sm:p-0">
      <div className="flex h-full w-full flex-col overflow-hidden bg-surface shadow-modal sm:w-[480px] sm:rounded-l-[16px]">
        <header className="flex h-[64px] shrink-0 items-center justify-between border-b border-line px-6">
          <h2 className="text-[18px] font-medium text-ink-primary">Commit to {batchName}</h2>
          <Link href={`/batches/${batchSlug}`} className="text-ink-secondary transition-colors hover:text-ink-primary"><X className="h-6 w-6" /></Link>
        </header>

        {step <= 4 ? <div className="flex shrink-0 justify-center gap-3 border-b border-surface-raised bg-canvas px-6 py-4">{[1, 2, 3, 4].map((i) => <div key={i} className={cn("h-2 w-2 rounded-full transition-colors", step === i ? "bg-brand-action" : step > i ? "bg-semantic-cleared" : "border border-ink-secondary")} />)}</div> : null}

        <div className="flex-1 overflow-y-auto px-6 py-8">
          {error && step !== 5 ? <div className="mb-5"><ErrorState title="Commit flow warning" message={error} /></div> : null}
          {step === 1 ? <QuantityStep quantity={quantity} setQuantity={setQuantity} total={batchTotal} currency={currency} status={status} lockedAfterClearing={lockedAfterClearing} /> : null}
          {step === 2 ? <DeliveryStep profiles={profiles} selectedProfileId={selectedProfileId} setSelectedProfileId={setSelectedProfileId} /> : null}
          {step === 3 ? <EscrowStep batchTotal={batchTotal} serviceFee={serviceFee} deliveryReserve={deliveryReserve} totalHeld={totalHeld} currency={currency} lockedAfterClearing={lockedAfterClearing} /> : null}
          {step === 4 ? <ConfirmStep totalHeld={totalHeld} currency={currency} batchName={batchName} idempotencyKey={idempotencyKey} /> : null}
          {step === 5 ? <ReceiptStep receipt={receipt} batchSlug={batchSlug} /> : null}
        </div>

        {step <= 4 ? <footer className="flex shrink-0 flex-col gap-3 border-t border-line bg-surface p-6">
          {step === 4 ? <p className="mb-2 text-center text-[12px] text-ink-secondary">By confirming, this single idempotency key is used for this user intent and retry-safe submission.</p> : null}
          <Button variant="primary" size="large" className="w-full" disabled={(step === 2 && profiles.length > 0 && !selectedProfileId) || submitting || !batch} onClick={() => step === 4 ? submitCommitment() : setStep((value) => value + 1)}>
            {submitting ? "Processing…" : step === 1 ? "Continue to Delivery" : step === 2 ? "Review Escrow" : step === 3 ? "Continue to Confirmation" : `Lock my commitment — ${formatMoney(totalHeld, currency)}`}
          </Button>
          {step > 1 ? <Button variant="ghost" className="w-full" onClick={() => setStep((value) => value - 1)}>Back</Button> : null}
        </footer> : null}
      </div>
    </div>
  );
}

function QuantityStep({ quantity, setQuantity, total, currency, status, lockedAfterClearing }: { quantity: number; setQuantity: (value: number) => void; total: number; currency: string; status: string; lockedAfterClearing: boolean }) {
  return <div className="flex flex-col gap-8"><div><h3 className="text-[20px] font-medium tracking-tight text-ink-primary">How many units?</h3><div className="mt-2"><CanonicalStatus status={status} /></div></div><div className="flex flex-col items-center gap-3 rounded-[12px] border border-line bg-surface p-8"><div className="flex items-center gap-6"><button className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-line text-[24px] text-ink-primary hover:bg-surface-raised" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button><input type="text" value={quantity} readOnly className="w-[80px] bg-transparent text-center font-mono text-[32px] font-medium text-ink-primary focus:outline-none" /><button className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-line text-[24px] text-ink-primary hover:bg-surface-raised" onClick={() => setQuantity(quantity + 1)}>+</button></div></div><div className="flex flex-col items-center gap-1"><p className="font-mono text-[24px] font-medium text-ink-primary">Total: {formatMoney(total, currency)}</p><p className="text-[14px] text-ink-secondary">{lockedAfterClearing ? "This batch has already cleared. Your commitment locks immediately." : "Refundable if the batch does not clear."}</p></div></div>;
}

function DeliveryStep({ profiles, selectedProfileId, setSelectedProfileId }: { profiles: JsonRecord[]; selectedProfileId: string | null; setSelectedProfileId: (id: string) => void }) {
  if (!profiles.length) return <div className="space-y-4"><h3 className="text-[20px] font-medium tracking-tight text-ink-primary">Delivery profile</h3><div className="rounded-[12px] border border-dashed border-line bg-canvas p-5 text-[13px] text-ink-secondary">No delivery profiles returned from GET /api/profile/delivery. You can continue with the batch default delivery mode, but no final delivery profile id will be sent.</div></div>;
  return <div className="space-y-4"><h3 className="text-[20px] font-medium tracking-tight text-ink-primary">Choose delivery profile</h3>{profiles.map((profile) => { const id = readText(profile, ["id", "profileId"]); const selected = selectedProfileId === id; return <label key={id} onClick={() => setSelectedProfileId(id)} className={cn("flex cursor-pointer flex-col rounded-[12px] border p-4 transition-all", selected ? "border-line-focus bg-semantic-escrowLight" : "border-line hover:bg-surface-raised")}><div className="mb-2 flex items-center gap-3"><input type="radio" checked={selected} readOnly className="text-semantic-escrow" /><span className="font-medium text-ink-primary">{readText(profile, ["label", "name"], "Delivery profile")}</span></div><div className="flex items-start gap-2 pl-7 text-[14px] text-ink-secondary"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /><span>{readText(profile, ["address", "addressLine", "hubCode"], "Address pending")}<br />{readText(profile, ["city", "country"], "")}</span></div></label>; })}</div>;
}

function EscrowStep({ batchTotal, serviceFee, deliveryReserve, totalHeld, currency, lockedAfterClearing }: { batchTotal: number; serviceFee: number; deliveryReserve: number; totalHeld: number; currency: string; lockedAfterClearing: boolean }) {
  const rows = [["Batch Price", batchTotal], ["Service fee", serviceFee], ["Delivery Reserve", deliveryReserve]];
  return <div className="space-y-6"><h3 className="text-[20px] font-medium tracking-tight text-ink-primary">Escrow Review</h3><div className="overflow-hidden rounded-[12px] border border-line bg-canvas">{rows.map(([label, value]) => <div key={String(label)} className="flex items-center justify-between border-b border-line px-4 py-3"><span className="text-[14px] text-ink-primary">{label}</span><span className="font-mono text-[14px] text-ink-primary">{formatMoney(value, currency)}</span></div>)}<div className="flex items-center justify-between bg-surface-raised px-4 py-4"><span className="text-[16px] font-medium text-ink-primary">Total Held in Escrow</span><span className="font-mono text-[18px] font-medium text-ink-primary">{formatMoney(totalHeld, currency)}</span></div></div><p className="text-center text-[12px] text-ink-secondary">{lockedAfterClearing ? "This batch has already cleared. Your commitment locks immediately and cannot be cancelled." : "Refundable if batch fails to clear."}</p></div>;
}

function ConfirmStep({ totalHeld, currency, batchName, idempotencyKey }: { totalHeld: number; currency: string; batchName: string; idempotencyKey: string }) {
  return <div className="flex flex-col items-center gap-6 py-12 text-center"><h3 className="text-[24px] font-medium tracking-tight text-ink-primary">Ready to lock funds?</h3><p className="max-w-sm text-[15px] leading-relaxed text-ink-secondary">You are committing {formatMoney(totalHeld, currency)} into the protected funds pool for {batchName}. Final confirmation waits for the backend response and payment lifecycle.</p><div className="rounded-[8px] bg-canvas px-3 py-2 font-mono text-[11px] text-ink-secondary">{idempotencyKey}</div></div>;
}

function ReceiptStep({ receipt, batchSlug }: { receipt: JsonRecord | null; batchSlug: string }) {
  return <div className="flex flex-col items-center gap-8 py-12 text-center"><CheckCircle2 className="h-[64px] w-[64px] text-semantic-cleared" /><div><h2 className="mb-2 font-display text-[28px] font-bold tracking-tight text-ink-primary">Committed.</h2><p className="text-[15px] text-ink-secondary">Your allocation is secured by the backend response.</p></div><div className="flex flex-col items-center gap-1 rounded-[12px] border border-line bg-surface-raised px-6 py-4"><span className="text-[12px] uppercase tracking-wide text-ink-secondary">Commitment ID</span><span className="flex items-center gap-2 font-mono text-[16px] font-medium text-ink-primary">{readText(receipt, ["id", "commitmentId"], "Returned by API")}<Copy className="h-4 w-4" /></span></div><div className="mt-4 flex w-full flex-col gap-3"><Link href="/app/my-batches" className="w-full"><Button variant="primary" size="large" className="w-full">View my commitment</Button></Link><Link href={`/batches/${batchSlug}`} className="w-full"><Button variant="ghost" size="large" className="w-full">Back to deal room</Button></Link></div></div>;
}

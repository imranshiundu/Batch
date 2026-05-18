import { batches } from "@/lib/data";

export const demoUsers = [
  { id: "buyer_demo", name: "Demo Buyer", email: "buyer@batch.local", phone: "+254700000001", role: "BUYER", country: "KE" },
  { id: "supplier_demo", name: "Demo Supplier", email: "supplier@batch.local", phone: "+254700000002", role: "SUPPLIER", country: "KE", businessName: "Demo Supplier Co" },
  { id: "operator_demo", name: "Demo Operator", email: "operator@batch.local", phone: "+254700000003", role: "OPERATOR", country: "KE" },
];

export const demoCommitments = [
  { id: "commit_demo_1", batchId: batches[0]?.slug, buyerId: "buyer_demo", quantity: 10, status: "ACTIVE", escrowStatus: "HELD" },
  { id: "commit_demo_2", batchId: batches[1]?.slug, buyerId: "buyer_demo", quantity: 4, status: "LOCKED", escrowStatus: "LOCKED" },
];

export const demoLedger = [
  { id: "ledger_1", type: "BUYER_COMMITMENT_HOLD", amount: 42, currency: "USD", status: "POSTED", batchId: batches[0]?.slug },
  { id: "ledger_2", type: "SUPPLIER_MILESTONE_RELEASE", amount: 320, currency: "USD", status: "PENDING", batchId: batches[1]?.slug },
  { id: "ledger_3", type: "REFUND", amount: 18, currency: "USD", status: "PENDING", batchId: "failed-demo-batch" },
];

export const demoDisputes = [
  { id: "dispute_1", batchId: batches[2]?.slug, buyerId: "buyer_demo", type: "DELIVERY_LATE", status: "OPEN", reason: "Delivery window passed without pickup code." },
];

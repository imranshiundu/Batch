export type BatchStatus =
  | "OPEN"
  | "FUNDED"
  | "ACTIVE"
  | "PRODUCTION"
  | "SHIPPED"
  | "RECEIVED_AT_HUB"
  | "FAILED";

export type BatchType =
  | "IMPORT_BATCH"
  | "LOCAL_SUPPLY_BATCH"
  | "MERCHANT_RESTOCK_BATCH"
  | "COMMUNITY_BATCH";

export type Batch = {
  slug: string;
  title: string;
  type: BatchType;
  supplier: string;
  location: string;
  status: BatchStatus;
  normalPrice: number;
  batchPrice: number;
  currency: string;
  minimumUnits: number;
  targetUnits: number;
  committedUnits: number;
  deadline: string;
  deliveryWindow: string;
  deliveryMode: string;
  riskLevel: "Low" | "Medium" | "High";
  escrowStatus: string;
  summary: string;
  milestones: string[];
};

export const batches: Batch[] = [
  {
    slug: "shenzhen-charger-restock",
    title: "Shenzhen 20W Charger Restock",
    type: "IMPORT_BATCH",
    supplier: "Demo Shenzhen Exporter",
    location: "Shenzhen to Nairobi",
    status: "OPEN",
    normalPrice: 8,
    batchPrice: 4.2,
    currency: "USD",
    minimumUnits: 500,
    targetUnits: 1000,
    committedUnits: 382,
    deadline: "2 days left",
    deliveryWindow: "18-30 days after clearing",
    deliveryMode: "Hub pickup or direct delivery",
    riskLevel: "Medium",
    escrowStatus: "Buyer funds protected until clearing",
    summary:
      "A merchant restock batch for small electronics sellers who want wholesale pricing without carrying the full import order alone.",
    milestones: [
      "Supplier confirms price and quantity",
      "Production or warehouse proof uploaded",
      "Shipping proof submitted",
      "Goods received at hub",
      "Buyer allocations delivered",
    ],
  },
  {
    slug: "school-uniform-batch",
    title: "School Uniform Batch",
    type: "LOCAL_SUPPLY_BATCH",
    supplier: "Demo Local Garment Workshop",
    location: "Nairobi",
    status: "FUNDED",
    normalPrice: 22,
    batchPrice: 16,
    currency: "USD",
    minimumUnits: 200,
    targetUnits: 600,
    committedUnits: 244,
    deadline: "Supplier confirmation due today",
    deliveryWindow: "7-10 days after confirmation",
    deliveryMode: "School pickup hub",
    riskLevel: "Low",
    escrowStatus: "Cleared. Supplier confirmation pending",
    summary:
      "A parent and school group batch for uniform sets with hub pickup and separate buyer allocations.",
    milestones: [
      "Supplier confirms fabric and sizing",
      "Cutting and stitching proof",
      "Hub receipt",
      "Pickup confirmation",
    ],
  },
  {
    slug: "salon-beauty-stock",
    title: "Salon Beauty Stock Restock",
    type: "MERCHANT_RESTOCK_BATCH",
    supplier: "Demo Regional Distributor",
    location: "Mombasa to Nairobi",
    status: "ACTIVE",
    normalPrice: 45,
    batchPrice: 31,
    currency: "USD",
    minimumUnits: 150,
    targetUnits: 300,
    committedUnits: 196,
    deadline: "Cleared",
    deliveryWindow: "5-8 days",
    deliveryMode: "Merchant allocation",
    riskLevel: "Low",
    escrowStatus: "Milestone release active",
    summary:
      "A salon owner restock batch for consumables, cartons, and professional stock ordered in different quantities.",
    milestones: [
      "Supplier confirmed",
      "Warehouse proof approved",
      "Dispatch pending",
      "Buyer allocation pending",
    ],
  },
];

export const dashboardStats = [
  { label: "Protected in escrow", value: "$1,428" },
  { label: "Active commitments", value: "4" },
  { label: "Batches clearing soon", value: "3" },
  { label: "Pending deliveries", value: "2" },
];

export function progress(batch: Batch) {
  return Math.min(100, Math.round((batch.committedUnits / batch.minimumUnits) * 100));
}

export function savings(batch: Batch) {
  return Math.round(((batch.normalPrice - batch.batchPrice) / batch.normalPrice) * 100);
}

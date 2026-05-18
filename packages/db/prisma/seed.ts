import { prisma } from "../src/client";

async function main() {
  const buyer = await prisma.user.upsert({
    where: { email: "buyer@batch.local" },
    update: {},
    create: {
      id: "buyer_demo",
      name: "Demo Buyer",
      email: "buyer@batch.local",
      phone: "+254700000001",
      country: "KE",
      role: "BUYER",
      profiles: {
        create: { label: "Personal", defaultCurrency: "USD", defaultDeliveryMode: "Hub pickup" },
      },
    },
  });

  const supplierUser = await prisma.user.upsert({
    where: { email: "supplier@batch.local" },
    update: {},
    create: {
      id: "supplier_demo",
      name: "Demo Supplier",
      email: "supplier@batch.local",
      phone: "+254700000002",
      country: "KE",
      role: "SUPPLIER",
    },
  });

  const supplier = await prisma.supplier.upsert({
    where: { userId: supplierUser.id },
    update: {},
    create: {
      userId: supplierUser.id,
      businessName: "Demo Supplier Co",
      country: "KE",
      verificationStatus: "REVIEWED",
      riskLevel: "MEDIUM",
    },
  });

  const batch = await prisma.batch.upsert({
    where: { slug: "shenzhen-charger-restock" },
    update: {},
    create: {
      slug: "shenzhen-charger-restock",
      supplierId: supplier.id,
      title: "Shenzhen 20W Charger Restock",
      summary: "A pooled restock batch for small electronics merchants buying verified chargers at better unit pricing.",
      category: "Electronics",
      type: "IMPORT_BATCH",
      status: "OPEN",
      minimumUnits: 100,
      targetUnits: 300,
      minimumAmount: 420,
      currency: "USD",
      deadlineAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      deliveryMode: "Hub pickup or merchant allocation",
      riskLevel: "MEDIUM",
      tiers: {
        create: [
          { minUnits: 1, unitPrice: 4.2, label: "Starter" },
          { minUnits: 50, unitPrice: 3.9, label: "Group price" },
          { minUnits: 150, unitPrice: 3.55, label: "Cleared batch price" },
        ],
      },
      milestones: {
        create: [
          { name: "Supplier confirmation", sequence: 1, releasePercent: 10, requiredProofType: "INVOICE", dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2) },
          { name: "Production or packing proof", sequence: 2, releasePercent: 40, requiredProofType: "PRODUCTION_PHOTO", dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10) },
          { name: "Warehouse receipt", sequence: 3, releasePercent: 30, requiredProofType: "WAREHOUSE_RECEIPT", dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 18) },
          { name: "Delivery scan", sequence: 4, releasePercent: 20, requiredProofType: "DELIVERY_SCAN", dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 28) },
        ],
      },
    },
  });

  console.log({ buyer: buyer.email, supplier: supplier.businessName, batch: batch.slug });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

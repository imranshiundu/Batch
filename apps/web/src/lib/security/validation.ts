import { z, type ZodSchema } from "zod";
import { fail } from "@/lib/api-response";

export async function parseJson<T>(request: Request, schema: ZodSchema<T>) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return {
      ok: false as const,
      response: fail({
        code: "VALIDATION_ERROR",
        message: "Request body failed validation.",
        detail: { issues: parsed.error.flatten() },
      }, 400),
    };
  }

  return { ok: true as const, data: parsed.data };
}

export const createCommitmentSchema = z.object({
  batchId: z.string().min(1),
  quantity: z.number().int().positive().max(100000),
  deliveryProfileId: z.string().min(1).optional(),
});

export const profilePatchSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  phone: z.string().min(5).max(32).optional(),
  country: z.string().min(2).max(64).optional(),
  defaultCurrency: z.string().min(3).max(8).optional(),
  defaultDeliveryMode: z.string().max(80).optional(),
}).strict();

export const supplierBatchDraftSchema = z.object({
  title: z.string().min(3).max(160),
  summary: z.string().min(10).max(2000).optional(),
  type: z.string().min(3).max(80).optional(),
  minimumUnits: z.number().int().positive(),
  targetUnits: z.number().int().positive().optional(),
  currency: z.string().min(3).max(8).optional(),
  deliveryMode: z.string().min(2).max(120).optional(),
}).strict();

export const proofSubmissionSchema = z.object({
  milestoneId: z.string().min(1),
  proofType: z.string().min(2).max(80),
  fileUrl: z.string().url().optional(),
  notes: z.string().max(2000).optional(),
}).strict();

export const disputeSchema = z.object({
  batchId: z.string().min(1),
  commitmentId: z.string().min(1).optional(),
  type: z.string().min(2).max(80).optional(),
  reason: z.string().min(5).max(2000),
}).strict();

export const transitionSchema = z.object({
  to: z.string().min(2).max(80),
  reason: z.string().min(5).max(1000).optional(),
}).strict();

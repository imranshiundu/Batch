import type { DomainResult, MilestoneRule } from "./types";

export function validateMilestonePlan(milestones: MilestoneRule[]): DomainResult<MilestoneRule[]> {
  if (milestones.length === 0) {
    return {
      ok: false,
      error: {
        code: "MILESTONE_PLAN_REQUIRED",
        message: "Every batch needs a milestone payout plan.",
      },
    };
  }

  const totalRelease = milestones.reduce((sum, milestone) => sum + milestone.releasePercent, 0);
  if (Math.round(totalRelease * 100) / 100 !== 100) {
    return {
      ok: false,
      error: {
        code: "INVALID_MILESTONE_RELEASE_TOTAL",
        message: "Milestone release percentages must total 100%.",
        detail: { totalRelease },
      },
    };
  }

  const sequences = milestones.map((milestone) => milestone.sequence);
  const uniqueSequences = new Set(sequences);
  if (uniqueSequences.size !== milestones.length) {
    return {
      ok: false,
      error: {
        code: "DUPLICATE_MILESTONE_SEQUENCE",
        message: "Milestone sequence numbers must be unique.",
      },
    };
  }

  return { ok: true, data: [...milestones].sort((a, b) => a.sequence - b.sequence) };
}

export function calculateMilestoneReleaseAmount(batchEscrowAmount: number, milestone: MilestoneRule): DomainResult<number> {
  if (batchEscrowAmount <= 0) {
    return {
      ok: false,
      error: {
        code: "INVALID_BATCH_ESCROW_AMOUNT",
        message: "Batch escrow amount must be greater than zero before milestone release.",
      },
    };
  }

  if (milestone.status !== "APPROVED") {
    return {
      ok: false,
      error: {
        code: "MILESTONE_NOT_APPROVED",
        message: "Milestone must be approved before release calculation.",
        detail: { status: milestone.status },
      },
    };
  }

  return { ok: true, data: Math.round(batchEscrowAmount * (milestone.releasePercent / 100) * 100) / 100 };
}

export function markOverdueMilestones(milestones: MilestoneRule[], now: Date): MilestoneRule[] {
  return milestones.map((milestone) => {
    if (["WAITING", "SUBMITTED"].includes(milestone.status) && now > milestone.dueAt) {
      return { ...milestone, status: "OVERDUE" };
    }

    return milestone;
  });
}

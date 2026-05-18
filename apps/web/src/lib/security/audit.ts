export type AuditDraft = {
  actorId: string;
  actorRole: string;
  action: string;
  targetType: string;
  targetId: string;
  before?: unknown;
  after?: unknown;
  reason?: string;
  createdAt: string;
};

export function createAuditDraft(input: Omit<AuditDraft, "createdAt">): AuditDraft {
  return { ...input, createdAt: new Date().toISOString() };
}

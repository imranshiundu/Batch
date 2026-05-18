import { fail } from "@/lib/api-response";

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

export function validateUploadRequest(input: { filename?: string; mimeType?: string; sizeBytes?: number }) {
  if (!input.filename || input.filename.length > 180) {
    return fail({ code: "INVALID_UPLOAD_FILENAME", message: "A valid file name is required." }, 400);
  }

  if (!input.mimeType || !allowedMimeTypes.has(input.mimeType)) {
    return fail({ code: "UNSUPPORTED_UPLOAD_TYPE", message: "Only JPEG, PNG, WebP, and PDF files are allowed for proof uploads." }, 400);
  }

  if (!input.sizeBytes || input.sizeBytes <= 0 || input.sizeBytes > 10 * 1024 * 1024) {
    return fail({ code: "INVALID_UPLOAD_SIZE", message: "Proof files must be between 1 byte and 10 MB." }, 400);
  }

  return null;
}

export function createPendingUpload(input: { filename: string; mimeType: string; sizeBytes: number; ownerId: string }) {
  return {
    uploadId: `upload_${Date.now()}`,
    ownerId: input.ownerId,
    filename: input.filename,
    mimeType: input.mimeType,
    sizeBytes: input.sizeBytes,
    status: "PENDING_STORAGE_ADAPTER",
    storageKey: `proofs/${input.ownerId}/${Date.now()}-${input.filename.replace(/[^a-zA-Z0-9._-]/g, "-")}`,
    scanRequired: true,
  };
}

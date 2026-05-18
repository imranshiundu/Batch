import { NextResponse } from "next/server";

export type ApiError = {
  code: string;
  message: string;
  detail?: Record<string, unknown>;
};

export function ok<T>(data: T, meta: Record<string, unknown> = {}, status = 200) {
  return NextResponse.json({ ok: true, data, meta, error: null }, { status });
}

export function fail(error: ApiError, status = 400, meta: Record<string, unknown> = {}) {
  return NextResponse.json({ ok: false, data: null, meta, error }, { status });
}

export function methodNotAllowed(method: string) {
  return fail({ code: "METHOD_NOT_ALLOWED", message: `${method} is not allowed for this endpoint.` }, 405);
}

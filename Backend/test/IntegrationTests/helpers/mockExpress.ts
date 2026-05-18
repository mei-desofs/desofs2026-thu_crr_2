import type { Request, Response } from "express";
import { vi } from "vitest";

/** `res.status(n).json(body)` como no Express */
export function createMockResponse(): {
  res: Response;
  status: ReturnType<typeof vi.fn>;
  json: ReturnType<typeof vi.fn>;
} {
  const json = vi.fn();
  const status = vi.fn().mockImplementation(() => ({ json }));
  return {
    res: { status, json } as unknown as Response,
    status,
    json,
  };
}

export function createMockRequest(partial: Partial<Request> & { body?: Record<string, unknown> }): Request {
  return partial as Request;
}

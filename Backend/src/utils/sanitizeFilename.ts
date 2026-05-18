import path from "path";

export function sanitizeFilename(filename: string): string {
  // Strip any directory components, keep only the base name
  const base = path.basename(filename);

  // Allow only alphanumeric, dash, underscore, dot
  const safe = base.replace(/[^a-zA-Z0-9._-]/g, "_");

  // Prevent hidden files or relative tricks
  if (!safe || safe.startsWith(".")) {
    throw new Error("INVALID_FILENAME");
  }

  return safe;
}
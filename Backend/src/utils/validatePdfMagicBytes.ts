import fs from "fs";

// MT16-Solution: validate PDF magic bytes (R6 — PDF upload validation)
// A real PDF always starts with the 4-byte signature: %PDF  (25 50 44 46)
const PDF_MAGIC = Buffer.from([0x25, 0x50, 0x44, 0x46]); // %PDF

export function isPdfMagicBytes(filePath: string): boolean {
  const fd = fs.openSync(filePath, "r");
  const buf = Buffer.alloc(4);
  fs.readSync(fd, buf, 0, 4, 0);
  fs.closeSync(fd);
  return buf.equals(PDF_MAGIC);
}

/**
 * Validates every uploaded file and deletes any that fail the magic-byte check.
 * Returns the list of invalid files (empty = all OK).
 */
export function rejectNonPdfFiles(files: Express.Multer.File[]): Express.Multer.File[] {
  const invalid: Express.Multer.File[] = [];
  for (const file of files) {
    if (!isPdfMagicBytes(file.path)) {
      fs.unlinkSync(file.path); // remove from disk immediately
      invalid.push(file);
    }
  }
  return invalid;
}
import { ParsedPDF } from "./types.ts";

/**
 * Handles PDF parsing logic.
 * Note: PDF text extraction is currently an explicit limitation in the Deno Edge Function
 * environment due to lack of standard, lightweight, and sandbox-compatible dependencies.
 *
 * @param _data Binary representation of the PDF file (Uint8Array).
 * @returns Parsed pages structure.
 * @throws Error explaining that PDF parsing is unsupported.
 */
export function parsePDF(_data: Uint8Array): ParsedPDF {
  throw new Error("PDF text extraction is not yet supported in this environment. Please upload CSV or XLSX files instead.");
}

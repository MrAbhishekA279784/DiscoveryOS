import * as XLSX from "https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs";
import { ParsedXLSX } from "./types.ts";

/**
 * Parses an Excel (XLSX/XLS) file into a structured object representing sheets, headers, and rows.
 * Uses SheetJS (xlsx) ESM package compatible with Deno runtime.
 *
 * @param data Binary representation of the Excel file (Uint8Array).
 * @param maxRows Optional safety limit per sheet to prevent unbounded memory usage.
 * @returns An array of parsed sheets.
 * @throws Error if parsing fails or row limits are exceeded.
 */
export function parseXLSX(data: Uint8Array, maxRows = 100000): ParsedXLSX {
  if (!data || data.length === 0) {
    throw new Error("Cannot parse empty Excel file data.");
  }

  const workbook = XLSX.read(data, { type: "array" });
  const result: ParsedXLSX = [];

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    // sheet_to_json with header: 1 returns a 2D array of rows
    const jsonData = XLSX.utils.sheet_to_json<unknown[]>(worksheet, { header: 1 });
    
    if (jsonData.length === 0) {
      result.push({ name: sheetName, headers: [], rows: [] });
      continue;
    }

    // First row forms headers, coercion to string
    const rawHeaders = jsonData[0] as unknown[];
    const headers = rawHeaders.map((h) => String(h ?? "").trim());

    const rows: Record<string, string | number | boolean | null>[] = [];

    for (let i = 1; i < jsonData.length; i++) {
      if (rows.length >= maxRows) {
        throw new Error(`XLSX sheet "${sheetName}" exceeds maximum row limit of ${maxRows}.`);
      }

      const dataRow = jsonData[i] as unknown[];
      
      // Skip completely empty rows
      if (!dataRow || dataRow.length === 0 || dataRow.every((cell) => cell === undefined || cell === null || cell === "")) {
        continue;
      }

      const rowObj: Record<string, string | number | boolean | null> = {};
      for (let j = 0; j < headers.length; j++) {
        const val = j < dataRow.length ? dataRow[j] : null;
        
        if (val === undefined || val === null) {
          rowObj[headers[j]] = null;
        } else if (typeof val === "boolean" || typeof val === "number" || typeof val === "string") {
          rowObj[headers[j]] = val;
        } else {
          rowObj[headers[j]] = String(val);
        }
      }
      rows.push(rowObj);
    }

    result.push({
      name: sheetName,
      headers,
      rows,
    });
  }

  return result;
}

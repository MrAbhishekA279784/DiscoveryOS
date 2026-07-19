import { ParsedCSV } from "./types.ts";

/**
 * Parses a CSV string into a structured object containing headers and rows.
 * Implements RFC 4180 standard rules, supporting double quotes, escaped quotes,
 * commas and newlines inside quoted fields.
 *
 * @param text The raw CSV text content to parse.
 * @param maxRows Optional safety limit to prevent unbounded memory usage.
 * @returns An object with headers and rows.
 * @throws Error if the file is invalid or cannot be parsed.
 */
export function parseCSV(text: string, maxRows = 100000): ParsedCSV {
  if (!text || text.trim() === "") {
    return { headers: [], rows: [] };
  }

  const result: string[][] = [];
  let row: string[] = [];
  let curr = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped double quote
          curr += '"';
          i++; // Skip the next double quote
        } else {
          // Closing double quote
          inQuotes = false;
        }
      } else {
        curr += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(curr);
        curr = "";
      } else if (char === "\n" || char === "\r") {
        row.push(curr);
        curr = "";
        result.push(row);
        row = [];

        // Check if we hit the row limit to prevent memory overflow
        if (result.length > maxRows + 1) {
          throw new Error(`CSV exceeds maximum row limit of ${maxRows}.`);
        }

        if (char === "\r" && nextChar === "\n") {
          i++; // Skip the newline character following carriage return
        }
      } else {
        curr += char;
      }
    }
  }

  // Handle last row if file did not end with a newline
  if (curr !== "" || row.length > 0) {
    row.push(curr);
    result.push(row);
  }

  // Filter out empty rows (commonly trailing newlines)
  const filteredResult = result.filter(
    (r) => r.length > 0 && !(r.length === 1 && r[0] === "")
  );

  if (filteredResult.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = filteredResult[0].map((h) => h.trim());
  const rows: Record<string, string | number | boolean | null>[] = [];

  for (let i = 1; i < filteredResult.length; i++) {
    const dataRow = filteredResult[i];
    const rowObj: Record<string, string | number | boolean | null> = {};
    
    for (let j = 0; j < headers.length; j++) {
      const val = j < dataRow.length ? dataRow[j].trim() : "";
      
      // Parse basic types if they look numeric or boolean, otherwise keep as string or null
      if (val === "") {
        rowObj[headers[j]] = null;
      } else if (val.toLowerCase() === "true") {
        rowObj[headers[j]] = true;
      } else if (val.toLowerCase() === "false") {
        rowObj[headers[j]] = false;
      } else {
        const num = Number(val);
        rowObj[headers[j]] = isNaN(num) ? val : num;
      }
    }
    rows.push(rowObj);
  }

  return { headers, rows };
}

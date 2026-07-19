import { assertEquals, assertThrows } from "https://deno.land/std@0.224.0/assert/mod.ts";
import * as XLSX from "https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs";
import { parseXLSX } from "./xlsx.ts";

Deno.test("XLSX Parser - parses valid in-memory spreadsheet", () => {
  // 1. Build a dummy workbook in memory using SheetJS
  const ws = XLSX.utils.aoa_to_sheet([
    ["Name", "Score", "Pass"],
    ["Alice", 95, true],
    ["Bob", 50, false],
  ]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "TestSheet");

  // 2. Export workbook to raw binary array
  const rawBytes = XLSX.write(wb, { type: "array", bookType: "xlsx" });
  const data = new Uint8Array(rawBytes);

  // 3. Test parseXLSX
  const parsed = parseXLSX(data);

  assertEquals(parsed.length, 1);
  assertEquals(parsed[0].name, "TestSheet");
  assertEquals(parsed[0].headers, ["Name", "Score", "Pass"]);
  assertEquals(parsed[0].rows, [
    { Name: "Alice", Score: 95, Pass: true },
    { Name: "Bob", Score: 50, Pass: false },
  ]);
});

Deno.test("XLSX Parser - throws error on empty spreadsheet data", () => {
  assertThrows(() => {
    parseXLSX(new Uint8Array(0));
  }, Error, "Cannot parse empty Excel file data.");
});

Deno.test("XLSX Parser - respects maximum row limits", () => {
  const ws = XLSX.utils.aoa_to_sheet([
    ["col"],
    ["row1"],
    ["row2"],
    ["row3"],
  ]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "SheetLimit");

  const rawBytes = XLSX.write(wb, { type: "array", bookType: "xlsx" });
  const data = new Uint8Array(rawBytes);

  assertThrows(() => {
    parseXLSX(data, 2);
  }, Error, 'XLSX sheet "SheetLimit" exceeds maximum row limit of 2.');
});

import { assertEquals, assertThrows } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { parseCSV } from "./csv.ts";

Deno.test("CSV Parser - parses valid simple CSV content", () => {
  const csv = "name,age,active\nAlice,30,true\nBob,25,false";
  const result = parseCSV(csv);
  
  assertEquals(result.headers, ["name", "age", "active"]);
  assertEquals(result.rows, [
    { name: "Alice", age: 30, active: true },
    { name: "Bob", age: 25, active: false }
  ]);
});

Deno.test("CSV Parser - handles empty file gracefully", () => {
  const csv = "";
  const result = parseCSV(csv);
  
  assertEquals(result.headers, []);
  assertEquals(result.rows, []);
});

Deno.test("CSV Parser - parses commas and newlines inside quoted fields", () => {
  const csv = 'id,feedback\n1,"Hello, this is a feedback with, commas"\n2,"This has a \n newline inside"';
  const result = parseCSV(csv);

  assertEquals(result.headers, ["id", "feedback"]);
  assertEquals(result.rows.length, 2);
  assertEquals(result.rows[0].feedback, "Hello, this is a feedback with, commas");
  assertEquals(result.rows[1].feedback, "This has a \n newline inside");
});

Deno.test("CSV Parser - supports escaped double quotes", () => {
  const csv = 'id,value\n1,"This has ""escaped"" quotes"';
  const result = parseCSV(csv);

  assertEquals(result.headers, ["id", "value"]);
  assertEquals(result.rows[0].value, 'This has "escaped" quotes');
});

Deno.test("CSV Parser - throws error on exceeding maximum row limit", () => {
  const csv = "col1\nrow1\nrow2\nrow3";
  assertThrows(() => {
    parseCSV(csv, 2);
  }, Error, "CSV exceeds maximum row limit of 2");
});

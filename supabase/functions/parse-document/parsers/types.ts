/**
 * Shared types for the parsed documents.
 */

export interface ParsedCSV {
  headers: string[];
  rows: Record<string, string | number | boolean | null>[];
}

export interface ParsedXLSXSheet {
  name: string;
  headers: string[];
  rows: Record<string, string | number | boolean | null>[];
}

export type ParsedXLSX = ParsedXLSXSheet[];

export interface ParsedPDFPage {
  page_number: number;
  text: string;
}

export type ParsedPDF = ParsedPDFPage[];

export type ParsedContent = ParsedCSV | ParsedXLSX | ParsedPDF;

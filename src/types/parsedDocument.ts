import { FileItem } from "../types";

export type DocumentStatus = "uploaded" | "processing" | "completed" | "failed";

export interface DocumentRow extends Omit<FileItem, "timestamp"> {
  id: string;
  user_id: string;
  file_name: string;
  file_type: "csv" | "xlsx" | "pdf";
  file_size: number;
  storage_path: string;
  status: DocumentStatus;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface ParsedCSVContent {
  headers: string[];
  rows: Record<string, string | number | boolean | null>[];
}

export interface ParsedXLSXSheetContent {
  name: string;
  headers: string[];
  rows: Record<string, string | number | boolean | null>[];
}

export type ParsedXLSXContent = ParsedXLSXSheetContent[];

export interface ParsedPDFPageContent {
  page_number: number;
  text: string;
}

export type ParsedPDFContent = ParsedPDFPageContent[];

export type ParsedContentData = ParsedCSVContent | ParsedXLSXContent | ParsedPDFContent;

export interface ParsedDocumentRow {
  id: string;
  document_id: string;
  content: ParsedContentData;
  row_count: number | null;
  column_names: string[] | null;
  page_count: number | null;
  created_at: string;
}

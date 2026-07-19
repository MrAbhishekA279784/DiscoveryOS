// ============================================================
// Edge Function: parse-document
// Description: Triggered automatically or manually to parse uploaded
//              documents (CSV/XLSX) from storage and persist
//              the structured JSON output into parsed_documents.
// Flow:
// 1. Receives { documentId }
// 2. Fetches documents row, guards with idempotency (must be 'uploaded' or 'failed')
// 3. Updates status to 'processing'
// 4. Downloads document from 'documents' storage bucket
// 5. Parses content based on file_type
// 6. Inserts or updates parsed_documents, updates status to 'completed'
// 7. Handles failures gracefully by writing status = 'failed' + error_message
// ============================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";
import { parseCSV } from "./parsers/csv.ts";
import { parseXLSX } from "./parsers/xlsx.ts";
import { parsePDF } from "./parsers/pdf.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Safety Limits
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
const MAX_ROWS = 100000;

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  let documentId = "";
  
  // Initialize Supabase Client with Service Role Key (secure, bypasses RLS)
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    if (req.method !== "POST") {
      throw new Error("Only POST requests are supported.");
    }

    const body = await req.json().catch(() => ({}));
    documentId = body.documentId;

    if (!documentId || typeof documentId !== "string" || documentId.trim() === "") {
      return new Response(
        JSON.stringify({ success: false, error: "Missing or invalid documentId in request body." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Fetch document metadata
    const { data: doc, error: docError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .single();

    if (docError || !doc) {
      throw new Error(`Failed to fetch document metadata: ${docError?.message || "Not found"}`);
    }

    // Idempotency guard: prevent duplicate runs on currently processing documents
    if (doc.status === "processing" || doc.status === "completed") {
      return new Response(
        JSON.stringify({
          success: true,
          documentId,
          status: doc.status,
          message: `Document is already in '${doc.status}' state. Skipping parse.`,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Guard on maximum file size
    if (Number(doc.file_size) > MAX_FILE_SIZE_BYTES) {
      throw new Error(`File size (${(Number(doc.file_size) / (1024 * 1024)).toFixed(2)}MB) exceeds maximum limit of 50MB.`);
    }

    // 2. Set status to 'processing'
    const { error: updateStatusError } = await supabase
      .from("documents")
      .update({ status: "processing", error_message: null, updated_at: new Date().toISOString() })
      .eq("id", documentId);

    if (updateStatusError) {
      throw new Error(`Failed to update status to processing: ${updateStatusError.message}`);
    }

    // 3. Download file from storage
    const { data: fileBlob, error: downloadError } = await supabase.storage
      .from("documents")
      .download(doc.storage_path);

    if (downloadError || !fileBlob) {
      throw new Error(`Failed to download file from storage bucket: ${downloadError?.message || "Empty response"}`);
    }

    const fileData = new Uint8Array(await fileBlob.arrayBuffer());

    // 4. Branch on file_type and Parse
    let parsedContent: unknown;
    let rowCount = 0;
    let colNames: string[] = [];
    let pageCount = 0;

    if (doc.file_type === "csv") {
      const decoder = new TextDecoder("utf-8");
      const csvText = decoder.decode(fileData);
      const csvParsed = parseCSV(csvText, MAX_ROWS);
      parsedContent = csvParsed;
      rowCount = csvParsed.rows.length;
      colNames = csvParsed.headers;
      pageCount = 1;
    } else if (doc.file_type === "xlsx") {
      const xlsxParsed = parseXLSX(fileData, MAX_ROWS);
      parsedContent = xlsxParsed;
      // Sum row counts and aggregate distinct headers across sheets
      const allHeaders = new Set<string>();
      for (const sheet of xlsxParsed) {
        rowCount += sheet.rows.length;
        sheet.headers.forEach((h) => allHeaders.add(h));
      }
      colNames = Array.from(allHeaders);
      pageCount = xlsxParsed.length; // Sheets mapped to pageCount for spreadsheet
    } else if (doc.file_type === "pdf") {
      // Stub PDF parser throwing error will run this branch and fail gracefully
      const pdfParsed = parsePDF(fileData);
      parsedContent = pdfParsed;
      rowCount = 0;
      colNames = [];
      pageCount = pdfParsed.length;
    } else {
      throw new Error(`Unsupported file type: ${doc.file_type}`);
    }

    // 5. Persist the structured results into parsed_documents (UPSERT on conflict document_id)
    const { error: insertError } = await supabase
      .from("parsed_documents")
      .upsert(
        {
          document_id: documentId,
          content: parsedContent,
          row_count: rowCount,
          column_names: colNames,
          page_count: pageCount,
          created_at: new Date().toISOString(),
        },
        { onConflict: "document_id" }
      );

    if (insertError) {
      throw new Error(`Failed to insert/update parsed document: ${insertError.message}`);
    }

    // 6. Complete status updates
    const { error: completeStatusError } = await supabase
      .from("documents")
      .update({ status: "completed", updated_at: new Date().toISOString() })
      .eq("id", documentId);

    if (completeStatusError) {
      throw new Error(`Failed to finalize document status: ${completeStatusError.message}`);
    }

    return new Response(
      JSON.stringify({ success: true, documentId, status: "completed" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[Error parsing document ${documentId}]:`, errorMsg);

    // Ensure we do not leave the document row stuck in 'processing' status
    if (documentId) {
      await supabase
        .from("documents")
        .update({
          status: "failed",
          error_message: errorMsg,
          updated_at: new Date().toISOString(),
        })
        .eq("id", documentId)
        .catch((dbErr) => console.error("Critical fallback failed to write failure status:", dbErr));
    }

    return new Response(
      JSON.stringify({ success: false, documentId, status: "failed", error: errorMsg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

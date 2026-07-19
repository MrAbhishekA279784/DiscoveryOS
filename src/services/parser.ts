import { supabase } from "../lib/supabase";

/**
 * Triggers manual parsing (or re-parsing) of a document by calling
 * the 'parse-document' Supabase Edge Function.
 *
 * @param documentId The UUID of the document in the documents table.
 * @returns Object indicating parsing request success status and optional error explanation.
 */
export async function triggerDocumentParse(documentId: string): Promise<{
  success: boolean;
  status?: string;
  error?: string;
}> {
  if (!documentId || documentId.trim() === "") {
    return { success: false, error: "Invalid or empty document ID provided." };
  }

  try {
    const { data, error } = await supabase.functions.invoke("parse-document", {
      body: { documentId },
    });

    if (error) {
      return {
        success: false,
        error: error.message || "An error occurred invoking the parse function.",
      };
    }

    return {
      success: data?.success ?? false,
      status: data?.status,
      error: data?.error,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

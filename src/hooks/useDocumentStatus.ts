import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { DocumentStatus } from "../types/parsedDocument";

/**
 * A React hook that subscribes to Realtime updates for a single document row.
 * Useful for displaying dynamic processing progress or showing toast alerts on completion.
 *
 * @param documentId The UUID of the document row to monitor.
 * @returns An object containing current status, error message, and initial loading state.
 */
export function useDocumentStatus(documentId: string): {
  status: DocumentStatus | null;
  errorMessage: string | null;
  isLoading: boolean;
} {
  const [status, setStatus] = useState<DocumentStatus | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!documentId || documentId.trim() === "") {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    // Fetch the current state from the database first
    const fetchStatus = async () => {
      try {
        const { data, error } = await supabase
          .from("documents")
          .select("status, error_message")
          .eq("id", documentId)
          .single();

        if (error) {
          console.warn(`[useDocumentStatus] Fetch error: ${error.message}`);
          if (isMounted) {
            setErrorMessage(error.message);
            setIsLoading(false);
          }
          return;
        }

        if (data && isMounted) {
          setStatus(data.status as DocumentStatus);
          setErrorMessage(data.error_message);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("[useDocumentStatus] Unexpected fetch error:", err);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchStatus();

    // Subscribe to real-time updates for the document row
    const statusChannel = supabase
      .channel(`doc_status_${documentId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "documents",
          filter: `id=eq.${documentId}`,
        },
        (payload) => {
          if (isMounted && payload.new) {
            const newStatus = payload.new.status as DocumentStatus;
            const newErr = payload.new.error_message as string | null;
            setStatus(newStatus);
            setErrorMessage(newErr);
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(statusChannel);
    };
  }, [documentId]);

  return { status, errorMessage, isLoading };
}

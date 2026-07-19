-- ============================================================
-- Migration: Create Documents and Parsed Documents Tables
-- Description: Sets up the input and output tables for the Parser
--              module along with RLS and trigger functions.
-- ============================================================

-- 1. Create documents table (Input Contract)
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('csv', 'xlsx', 'pdf')),
  file_size BIGINT NOT NULL,
  storage_path TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'completed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create parsed_documents table (Output Contract)
CREATE TABLE IF NOT EXISTS public.parsed_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  content JSONB NOT NULL,
  row_count INT,
  column_names TEXT[],
  page_count INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (document_id)
);

-- 3. Create Indexes for optimization
CREATE INDEX IF NOT EXISTS idx_documents_status ON public.documents (status);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents (user_id);
CREATE INDEX IF NOT EXISTS idx_parsed_documents_document_id ON public.parsed_documents (document_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parsed_documents ENABLE ROW LEVEL SECURITY;

-- 5. Define RLS Policies for documents table
CREATE POLICY "Users can view own documents"
  ON public.documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents"
  ON public.documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents"
  ON public.documents FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON public.documents FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role full access on documents"
  ON public.documents FOR ALL
  USING (true)
  WITH CHECK (true);

-- 6. Define RLS Policies for parsed_documents table (mirroring documents auth)
CREATE POLICY "Users can view own parsed documents"
  ON public.parsed_documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.documents
      WHERE documents.id = parsed_documents.document_id
      AND documents.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role full access on parsed_documents"
  ON public.parsed_documents FOR ALL
  USING (true)
  WITH CHECK (true);

-- 7. Trigger Setup to invoke edge function parse-document automatically on insert
-- Note: Requires pg_net extension to be enabled in Supabase.
CREATE OR REPLACE FUNCTION public.notify_parse_document()
RETURNS TRIGGER AS $$
DECLARE
  supabase_url TEXT;
  service_key TEXT;
BEGIN
  -- Obtain settings dynamically if possible, or fall back
  BEGIN
    supabase_url := current_setting('app.settings.supabase_functions_url', true);
    service_key := current_setting('app.settings.service_role_key', true);
  EXCEPTION WHEN OTHERS THEN
    supabase_url := NULL;
    service_key := NULL;
  END;

  -- Only trigger for newly uploaded documents and if parameters are configured
  IF NEW.status = 'uploaded' AND supabase_url IS NOT NULL AND service_key IS NOT NULL THEN
    PERFORM net.http_post(
      url := supabase_url || '/parse-document',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || service_key
      ),
      body := jsonb_build_object('documentId', NEW.id),
      timeout_milliseconds := 5000
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_document_uploaded
  AFTER INSERT ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_parse_document();

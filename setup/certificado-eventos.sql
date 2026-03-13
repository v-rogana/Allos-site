-- Certificado Eventos Temporários
-- Execute no Supabase SQL Editor

CREATE TABLE IF NOT EXISTS certificado_eventos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_inicio TIMESTAMPTZ NOT NULL,
  data_fim TIMESTAMPTZ NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE certificado_eventos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "certificado_eventos_public_read"
  ON certificado_eventos FOR SELECT
  USING (true);

CREATE POLICY "certificado_eventos_service_all"
  ON certificado_eventos FOR ALL
  USING (true)
  WITH CHECK (true);

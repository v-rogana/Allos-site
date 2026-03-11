-- Rodar no SQL Editor do Supabase
-- Adiciona campos de registro ao avaliadores existente

ALTER TABLE avaliadores ADD COLUMN IF NOT EXISTS telefone text;
ALTER TABLE avaliadores ADD COLUMN IF NOT EXISTS capacidade_semanal int DEFAULT 3;
ALTER TABLE avaliadores ADD COLUMN IF NOT EXISTS observacoes text;

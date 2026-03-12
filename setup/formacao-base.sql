-- =============================================
-- Formação Base: Gestão de Cronograma e Condutores
-- =============================================

-- Horários disponíveis (ex: 14:00, 16:00, 19:00)
CREATE TABLE formacao_horarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hora TEXT NOT NULL UNIQUE,
  ordem INT DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Slots = combinação dia + horário (cada célula do calendário)
-- dia_semana: 0=segunda, 1=terça, 2=quarta, 3=quinta, 4=sexta
CREATE TABLE formacao_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dia_semana INT NOT NULL CHECK (dia_semana BETWEEN 0 AND 4),
  horario_id UUID NOT NULL REFERENCES formacao_horarios(id) ON DELETE CASCADE,
  ativo BOOLEAN DEFAULT true,
  atividade_nome TEXT,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'conduzido', 'nao_conduzido', 'cancelado')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(dia_semana, horario_id)
);

-- Alocação de condutores aos slots
CREATE TABLE formacao_alocacoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slot_id UUID NOT NULL REFERENCES formacao_slots(id) ON DELETE CASCADE,
  condutor_id UUID NOT NULL REFERENCES certificado_condutores(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(slot_id, condutor_id)
);

-- Imagem do cronograma de divulgação
CREATE TABLE formacao_cronograma (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  imagem_base64 TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Adicionar telefone aos condutores existentes
ALTER TABLE certificado_condutores ADD COLUMN IF NOT EXISTS telefone TEXT;

-- Dados iniciais: horários comuns
INSERT INTO formacao_horarios (hora, ordem) VALUES
  ('14:00', 1),
  ('16:00', 2),
  ('19:00', 3);

-- Inserir linha inicial do cronograma (para ter um registro para update)
INSERT INTO formacao_cronograma (imagem_base64) VALUES (NULL);

-- RLS
ALTER TABLE formacao_horarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE formacao_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE formacao_alocacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE formacao_cronograma ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso total formacao_horarios" ON formacao_horarios FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso total formacao_slots" ON formacao_slots FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso total formacao_alocacoes" ON formacao_alocacoes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso total formacao_cronograma" ON formacao_cronograma FOR ALL USING (true) WITH CHECK (true);

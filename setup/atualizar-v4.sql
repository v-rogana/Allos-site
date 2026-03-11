-- ============================================
-- AvaliAllos v4 — Schema completo
-- ATENÇÃO: Roda isso DEPOIS do schema original.
-- Se quiser recomeçar do zero, rode DROP nas tabelas antigas primeiro.
-- ============================================

-- 1. Slots FIXOS (recorrentes semanais): "Segunda 14:00"
CREATE TABLE IF NOT EXISTS slots_fixos (
  id uuid primary key default gen_random_uuid(),
  dia_semana text not null,  -- 'segunda','terca','quarta','quinta','sexta','sabado','domingo'
  hora text not null,
  ativo boolean default true,
  criado_em timestamptz default now()
);

-- 2. Slots AVULSOS (data específica): "25/03 às 16:20"
-- Se já existe a tabela 'slots', vamos adicionar o campo no_formulario
ALTER TABLE slots ADD COLUMN IF NOT EXISTS no_formulario boolean DEFAULT false;

-- 3. Disponibilidade do avaliador nos FIXOS (recorrente: "eu posso toda segunda 14h")
CREATE TABLE IF NOT EXISTS avaliador_disp_fixo (
  id uuid primary key default gen_random_uuid(),
  avaliador_id uuid references avaliadores(id) on delete cascade,
  slot_fixo_id uuid references slots_fixos(id) on delete cascade,
  criado_em timestamptz default now(),
  unique(avaliador_id, slot_fixo_id)
);

-- 4. Preferências de fixos escolhidos pelo avaliado (JSON array de IDs)
ALTER TABLE avaliados ADD COLUMN IF NOT EXISTS fixos_escolhidos text DEFAULT '[]';
-- Manter slot_preferencia para compatibilidade
ALTER TABLE avaliados ADD COLUMN IF NOT EXISTS slot_preferencia text;

-- 5. RLS
ALTER TABLE slots_fixos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fixos_select" ON slots_fixos FOR SELECT USING (true);
CREATE POLICY "fixos_all" ON slots_fixos FOR ALL USING (true);

ALTER TABLE avaliador_disp_fixo ENABLE ROW LEVEL SECURITY;
CREATE POLICY "disp_fixo_select" ON avaliador_disp_fixo FOR SELECT USING (true);
CREATE POLICY "disp_fixo_all" ON avaliador_disp_fixo FOR ALL USING (true);

-- 6. Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE slots_fixos;
ALTER PUBLICATION supabase_realtime ADD TABLE avaliador_disp_fixo;

-- 7. Remover trigger que bloqueia bookings (lista de espera / controle manual)
DROP TRIGGER IF EXISTS trig_max_avaliados ON bookings;
DROP FUNCTION IF EXISTS enforce_max_avaliados();

-- 8. Mensagens WhatsApp (se não existir)
CREATE TABLE IF NOT EXISTS mensagens_whatsapp (
  id serial primary key,
  tipo text unique not null,
  titulo text not null,
  template text not null,
  criado_em timestamptz default now(),
  atualizado_em timestamptz default now()
);

INSERT INTO mensagens_whatsapp (tipo, titulo, template) VALUES
  ('confirmacao', 'Confirmação de avaliação',
   'Olá {nome}! Você foi selecionado(a) para avaliação na Associação Allos no dia {data} às {hora}. Por favor, confirme sua presença respondendo esta mensagem.'),
  ('cobranca', 'Aguardando resposta',
   'Olá {nome}, ainda estamos aguardando sua confirmação para a avaliação do dia {data} às {hora}. Caso não responda em 1 dia, sua vaga será liberada.'),
  ('remocao', 'Remoção da lista',
   'Olá {nome}, informamos que seu nome foi removido da lista de avaliação. Para se registrar novamente, acesse: {link}')
ON CONFLICT (tipo) DO NOTHING;

ALTER TABLE mensagens_whatsapp ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "msgs_select" ON mensagens_whatsapp FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "msgs_all" ON mensagens_whatsapp FOR ALL USING (true);

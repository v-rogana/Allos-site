-- Rodar no SQL Editor do Supabase
-- Quadro semanal de avaliações

CREATE TABLE IF NOT EXISTS quadro_slots (
  id uuid primary key default gen_random_uuid(),
  data date not null,
  hora text not null,
  criado_em timestamptz default now(),
  unique(data, hora)
);

CREATE TABLE IF NOT EXISTS quadro_participantes (
  id uuid primary key default gen_random_uuid(),
  quadro_slot_id uuid references quadro_slots(id) on delete cascade,
  tipo text not null,  -- 'avaliador' ou 'avaliado'
  nome text not null,
  telefone text,
  confirmado boolean default false,
  criado_em timestamptz default now()
);

ALTER TABLE quadro_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "qs_sel" ON quadro_slots FOR SELECT USING (true);
CREATE POLICY "qs_all" ON quadro_slots FOR ALL USING (true);

ALTER TABLE quadro_participantes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "qp_sel" ON quadro_participantes FOR SELECT USING (true);
CREATE POLICY "qp_all" ON quadro_participantes FOR ALL USING (true);

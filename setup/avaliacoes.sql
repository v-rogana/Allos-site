-- Rodar no SQL Editor do Supabase
-- Tabela de avaliações de seleção

CREATE TABLE IF NOT EXISTS avaliacoes (
  id serial primary key,
  data date not null default current_date,
  avaliador_id uuid references avaliadores(id) on delete set null,
  avaliado_id uuid references avaliados(id) on delete set null,
  nome_sessao text not null,
  estagio_mudanca int default 0,
  estrutura_coerencia int default 0,
  encerramento_abertura int default 0,
  acolhimento int default 0,
  seguranca_terapeuta int default 0,
  seguranca_metodo int default 0,
  aprofundamento int default 0,
  hipoteses int default 0,
  interpretacao int default 0,
  frase_timing int default 0,
  corpo_setting int default 0,
  insight_potencia int default 0,
  observacoes text,
  criado_em timestamptz default now()
);

ALTER TABLE avaliacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "aval_select" ON avaliacoes FOR SELECT USING (true);
CREATE POLICY "aval_all" ON avaliacoes FOR ALL USING (true);
ALTER PUBLICATION supabase_realtime ADD TABLE avaliacoes;

# Setup do Sistema de Certificados, Feedback e Formação

**Painel admin:** `/admin-formacao`
**Formulário público:** `/certificado`

## Tabelas no Supabase

Execute o SQL abaixo no Supabase SQL Editor para criar as tabelas necessárias.

```sql
-- Atividades disponíveis para seleção no formulário
CREATE TABLE certificado_atividades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Condutores dos grupos
CREATE TABLE certificado_condutores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Submissões do formulário (certificado + feedback)
CREATE TABLE certificado_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_completo TEXT NOT NULL,
  nome_social TEXT,
  email TEXT NOT NULL,
  atividade_nome TEXT NOT NULL,
  nota_grupo INTEGER CHECK (nota_grupo BETWEEN 1 AND 5),
  condutores TEXT[] DEFAULT '{}',
  nota_condutor INTEGER CHECK (nota_condutor BETWEEN 1 AND 5),
  relato TEXT,
  certificado_gerado BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Dados iniciais: atividades
INSERT INTO certificado_atividades (nome) VALUES
  ('Prática Clínica'),
  ('Aprimoramento Clínico'),
  ('Mesa de Estudos'),
  ('Duelo de Abordagem');

-- Dados iniciais: condutores
INSERT INTO certificado_condutores (nome) VALUES
  ('Rodolfo'), ('Gabriel'), ('Ângelo'), ('Arthur'),
  ('Bernardo'), ('Tainá'), ('Giúlia'), ('Cindy'),
  ('Adrian'), ('Ariane'), ('Alice Cheche'), ('Tássia'),
  ('Alan'), ('Beatriz'), ('Alice');

-- RLS policies
ALTER TABLE certificado_atividades ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificado_condutores ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificado_submissions ENABLE ROW LEVEL SECURITY;

-- Permitir todas as operações em atividades e condutores (gerenciadas pelo admin)
CREATE POLICY "Acesso total atividades" ON certificado_atividades
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Acesso total condutores" ON certificado_condutores
  FOR ALL USING (true) WITH CHECK (true);

-- Permitir inserção pública de submissions
CREATE POLICY "Inserção pública de submissions" ON certificado_submissions
  FOR INSERT WITH CHECK (true);

-- Permitir leitura de submissions (para rate limiting e admin)
CREATE POLICY "Leitura pública de submissions" ON certificado_submissions
  FOR SELECT USING (true);

-- Admin: permitir todas as operações via service role (bypass RLS)
-- As operações de admin usam o service role key que bypassa RLS automaticamente
```

## Variáveis de Ambiente

Adicione ao `.env.local`:

```
# Já existentes
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Nova: senha do admin de certificados (reutiliza a senha do admin existente)
NEXT_PUBLIC_CERTIFICADOS_ADMIN_PASSWORD=sua_senha_aqui
```

# AvaliAllos — Arquivos Completos

## Instruções para merge com o fork

### 1. Primeiro, puxe do fork do seu amigo:
```bash
git remote add fork https://github.com/SEU-AMIGO/Allos-site.git
git fetch fork
git merge fork/main --allow-unrelated-histories
```
(Se já tem o remote `fork` configurado, só `git fetch fork` e `git merge fork/main`)

### 2. Resolva conflitos se houver (aceite o que fizer sentido)

### 3. Copie TODOS os arquivos deste zip por cima do projeto
Extraia o zip e copie as pastas `src/` e `setup/` pra dentro do `allos-home/`, sobrescrevendo.

### 4. Commit e push:
```bash
git add .
git commit -m "AvaliAllos: sistema completo + merge com fork"
git push origin main
```

## Arquivos que NÃO estão neste zip (já existem no seu projeto):
- src/lib/supabase.ts
- src/app/api/avaliallos/auth/route.ts
- src/app/api/avaliallos/bookings/route.ts
- src/app/api/avaliallos/mensagens/route.ts
- src/app/api/avaliallos/disponibilidade/route.ts
- src/app/api/avaliallos/slots-form/route.ts
- .env.local

Esses arquivos foram criados no início do chat e não foram modificados depois.
Se por algum motivo faltarem, me avise.

## Arquivos neste zip (25 arquivos):

### Pages (3):
- src/app/avaliallos/page.tsx — Formulário público
- src/app/avaliallos/admin/page.tsx — Página admin
- src/app/avaliallos/avaliador/page.tsx — Página avaliador

### APIs (7):
- src/app/api/avaliallos/avaliacoes/route.ts
- src/app/api/avaliallos/avaliadores/route.ts
- src/app/api/avaliallos/avaliados/route.ts
- src/app/api/avaliallos/disponibilidade-fixo/route.ts
- src/app/api/avaliallos/quadro/route.ts
- src/app/api/avaliallos/slots-fixos/route.ts
- src/app/api/avaliallos/slots/route.ts

### Componentes (10):
- AdminPanel.tsx — Painel admin (quadro, avaliadores, fixos, avulsos, fila, avaliações, mensagens)
- AtmosphericBg.tsx — Background animado com estrelas
- AvaliacaoTool.tsx — Ferramenta de avaliação (criar, editar, ver, HTML, PDF)
- AvaliadorPanel.tsx — Painel avaliador (quadro, horários, rascunho, avaliações, diretrizes)
- DiretrizesPanel.tsx — Diretrizes e sistema de notas
- FormAvaliado.tsx — Formulário público de candidatos
- LoginForm.tsx — Login dark mode
- QuadroSemanal.tsx — Quadro semanal de avaliações
- RascunhoTool.tsx — Rascunho com cronômetro (localStorage)
- reportGenerator.ts — Gerador de relatório HTML + PDF

### SQL (5):
- setup/atualizar-v4.sql
- setup/avaliacoes.sql
- setup/avaliadores-registro.sql
- setup/criado-por.sql
- setup/quadro-semanal.sql

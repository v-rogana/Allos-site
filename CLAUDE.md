# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

- `npm run dev` — Start dev server (localhost:3000)
- `npm run build` — Production build
- `npm run start` — Run production server

No test runner or linter is configured.

## Architecture

**Next.js 14 App Router** site in TypeScript for the Allos psychology training institute. Uses `src/` directory structure.

### Routing

All pages live in `src/app/[route]/page.tsx`. Most follow this pattern:
```tsx
export const metadata = { /* SEO */ };
export default function PageName() {
  return (
    <>
      <NavBar />
      <main id="main-content">
        <DarkHero {...props} />
        <SpecificContent />
      </main>
      <Footer />
    </>
  );
}
```

Key route groups:
- Institutional: `/sobre`, `/clinica`, `/formacao`, `/parcerias`, `/faq`, `/documentos`, `/processo-seletivo`
- AvaliAllos didactic pages (training competencies): `/acolherser`, `/acolhimento`, `/abertura-encerramento`, `/aprofundamento`, `/pbe`, etc. — these reuse `DidaticTemplate`

### Components

- `src/components/` — Shared components (`NavBar`, `Footer`, `DarkHero`, `DarkInfoSection`, `DidaticTemplate`, `HeroSection`, `HeroCanvas`, `LoadingScreen`, `CustomCursor`)
- `src/components/[feature]/` — Feature-specific components grouped by page (e.g., `formacao/`, `processo/`, `clinica/`)
- Most components are `"use client"` for interactivity

### Key Libraries

- **Three.js** (`@react-three/fiber`, `@react-three/drei`) — 3D particle canvas on homepage, loaded via `next/dynamic` with SSR disabled
- **Framer Motion** — Scroll-triggered animations throughout
- **Tailwind CSS** — Primary styling; custom theme with colors (cream, charcoal, terracotta accent, sage) and fonts (Fraunces serif, DM Sans sans-serif)
- **Supabase** — Backend for AvaliAllos evaluation system (`src/lib/supabase.ts`)
- **Lucide React** — Icons

### Configuration

- Path alias: `@/*` → `./src/*`
- `next.config.mjs` transpiles `three` package
- TypeScript strict mode enabled

### Environment Variables

Requires `.env.local` (see `.env.local.example`):
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase connection
- `NEXT_PUBLIC_AVALIADOR_PASSWORD` / `NEXT_PUBLIC_ADMIN_PASSWORD` — Protected evaluation routes

### Data Layer

No API routes. Supabase client is used directly from client components. Database schema and setup details are in `SETUP.md`.

## Style Conventions

- Portuguese language for all user-facing content and route names
- Fluid typography with `clamp()` values
- Grain texture overlay applied globally via CSS pseudo-element
- Accessibility: ARIA labels, skip-link, semantic HTML

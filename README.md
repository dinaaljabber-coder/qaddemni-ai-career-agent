# QADDEМNI — AI Career Agent

A demo career execution workspace built with Next.js App Router, TypeScript, Tailwind CSS, and reusable UI components. The current version runs locally with seeded demo jobs and browser-stored profile, preferences, and activity. Supabase and OpenAI are integration boundaries only; the demo does not require credentials or connect to external services.

## Requirements

- Node.js 20 or newer
- pnpm 9 or newer

If pnpm is not installed and Node.js includes Corepack, enable it with `corepack enable`. On systems without Corepack, install pnpm using its official installation instructions.

## Run locally

From the project root:

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open <http://localhost:3000> in a modern browser. The development server prints its local URL when it starts.

## Production build

```bash
pnpm build
pnpm start
```

Then open <http://localhost:3000> to use the production build locally. Stop either server with `Ctrl+C`.

Optional checks:

```bash
pnpm typecheck
pnpm lint
```

## Environment variables

No environment variables are required to install, build, or run the demo. Do not create a `.env` file for local demo use.

`.env.example` lists optional placeholders for future integrations (Supabase, OpenAI, email, messaging, and payments). Those integrations are not enabled by this demo and their values should remain blank. Never share real keys in this project folder or commit them.

## Demo behavior

- Jobs and companies come from local seeded data through `DemoJobSource`.
- Profile details, language/theme preferences, saved jobs, and demo activity are stored in the browser; they are local to that browser profile and are not synced between devices.
- Career preparation, credit usage, and AI activity are demo interactions. No application is actually submitted and no email or message is sent.
- No external account or provider is needed for the demo.

## Project layout

- `src/app/` — App Router entry points, route handling, global styles, and app metadata.
- `src/components/` — Workspace, onboarding, jobs, profile, CV, application, credits, settings, and shared UI components.
- `src/lib/` — Demo data, matching, localization, browser storage, credit logic, job source abstraction, and server-side integration boundaries.
- `src/types/` — Shared domain types.
- `public/` — Static assets, including the supplied CV artwork.
- `package.json` and `pnpm-lock.yaml` — Scripts, dependencies, and reproducible dependency versions.

## Sharing this project

Share the complete project folder, including `README.md`, `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, the root configuration files, `src/`, and `public/`. The following are generated or machine-local and can be omitted: `.git/`, `node_modules/`, `.pnpm-store/`, `.next/`, `tsconfig.tsbuildinfo`, and any `.env*` files other than the safe placeholder `.env.example`.

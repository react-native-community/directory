# AGENTS.md

## Project overview

- This repo powers **React Native Directory**, a Next.js Pages Router app that renders a React Native Web / Expo UI and serves JSON endpoints from `pages/api/`.
- Keep `README.md` as the source of truth for contributor-facing dataset rules and `API.md` as the source of truth for the public API.
- Runtime data is generated from `react-native-libraries.json` into `assets/data.json` and `assets/check-data.json`.

## Architecture map

- `pages/` contains route entrypoints. These files are intentionally thin and usually fetch data, then hand props to scene components.
  - Examples: `pages/index.tsx`, `pages/packages.tsx`, `pages/popular.tsx`, `pages/trending.tsx`
  - Package detail routes live under `pages/package/[name]/...` and `pages/package/[name]/[scopedName]/...`
- `scenes/` contains page-level UI composition such as `HomeScene.tsx`, `PackageOverviewScene.tsx`, `PackageScoreScene.tsx`, and `PackageVersionsScene.tsx`.
- `components/` contains reusable UI pieces. `components/Libraries.tsx` dynamically imports `~/components/Library` for list rendering.
- `pages/api/` exposes the public JSON API documented in `API.md` and reads generated assets directly:
  - `pages/api/libraries/index.ts`
  - `pages/api/libraries/check.ts`
  - `pages/api/libraries/statistic.ts`
  - `pages/api/library/index.ts`
  - `pages/api/proxy/npm-stat.ts`
- `scripts/` contains dataset refresh, validation, cleanup, and LLM export jobs.
- `util/` contains shared query parsing, search/filter logic, sorting, cache constants, SSR helpers, and Tailwind setup.

## App conventions

- This repo uses the **Pages Router**, not the App Router. Add new pages under `pages/` and follow existing patterns like `getInitialProps` on listing pages and `getServerSideProps` on package detail pages.
- Keep page files thin. Put page layout in `scenes/` and shared UI in `components/`.
- Styling is primarily done with `twrnc` via ``tw`` from `util/tailwind.ts` and React Native style props, not CSS modules.
  - Example: `components/Search.tsx` and `scenes/HomeScene.tsx`
- Use the `~/*` path alias from `tsconfig.json` for internal imports.
- Follow the lint-enforced TypeScript style already used across the repo:
  - prefer function declarations over function expressions where practical
  - use inline type imports such as `import { type NextPageContext } from 'next';`
  - keep imports grouped/sorted in the existing style

## Data fetching and caching conventions

- Internal server-side fetches should go through `ssrFetch` from `util/SSRFetch.ts` unless a page needs custom header forwarding.
- If a page must preserve bookmark filtering on the server, forward cookies like `pages/packages.tsx` does.
- Use cache helpers from `util/Constants.ts` for external fetches:
  - `NEXT_1H_CACHE_HEADER` for internal API fetches
  - `NEXT_10M_CACHE_HEADER` for npm / proxy fetches
- `getApiUrl` builds absolute API URLs during SSR and relative `/api/...` URLs in the browser. Reuse it instead of hardcoding hosts.

## Search, filters, and query changes

- Query params are defined centrally in `types/index.ts` (`Query`, `QueryOrder`).
- Filtering behavior lives in `util/search.ts`.
- Filter button definitions and labels live in `components/Filters/helpers.ts`.
- Query normalization is intentionally minimal in `util/parseQueryParams.ts`.
- If you add, remove, or rename a filter or sort option, update the relevant set together:
  - `types/index.ts`
  - `components/Filters/helpers.ts`
  - `util/search.ts`
  - `pages/api/libraries/index.ts`
  - `API.md` when the public API changes

## Bookmarks behavior

- Bookmarks are cookie-backed via `context/BookmarksContext.tsx` using the `rnd_bookmarks` cookie.
- `/api/libraries` supports a `bookmarks` filter and disables public caching for those responses.
- Do not remove cookie forwarding or public/private cache behavior around bookmarks unless you update both the UI and API flow intentionally.

## Dataset workflow

- The only hand-edited dataset file is `react-native-libraries.json`.
- Add new library entries **at the end of the file**; the README documents that this order is used for “Recently added”.
- Allowed entry keys are enforced in `util/Constants.ts` (`VALID_ENTRY_KEYS`).
- Validation scripts also enforce:
  - GitHub URL shape and duplicates via `scripts/validate-libraries.ts`
  - npm/GitHub/package-name consistency for new or changed entries via `scripts/validate-new-entries.ts`
- `scripts/cleanup-libraries-json.ts` removes invalid keys, redundant `npmPkg`, empty arrays, and most `false` values. `lint-staged` runs this automatically for `react-native-libraries.json`.

## Generated files

- Do **not** hand-edit these generated files:
  - `assets/data.json`
  - `assets/check-data.json`
  - `public/llms.txt`
  - `public/llms-full.txt`
- They are produced by:
  - `bun data:update` / `bun data:update-missing`
  - `bun llms:generate`
- `scripts/generate-llms.ts` pulls content from `README.md`, `API.md`, and `assets/data.json`, so API or contributor-doc changes can require regenerating the LLM exports.

## Common commands

- Install dependencies:

```sh
bun install
```

- Start local dev server:

```sh
bun start
```

- Lint and format check:

```sh
bun lint
```

- Auto-fix lint/format issues:

```sh
bun lint:fix
```

- Dataset checks:

```sh
bun data:test
bun data:validate
bun ci:validate
bun libraries:check
```

- Dataset maintenance:

```sh
bun data:update
bun data:update-missing
bun libraries:cleanup
bun libraries:recalculate
bun llms:generate
```

- Production-style preview without refreshing data:

```sh
bun preview
```

## Environment and build notes

- `.env.example` documents `GITHUB_TOKEN` and `ANALYZE`.
- `bun build` runs `bun data:update && bun llms:generate && next build --webpack`, so builds that refresh data need a valid `GITHUB_TOKEN`.
- `vercel.json` injects `GITHUB_TOKEN` for hosted builds.
- `scripts/build-and-score-data.ts` contains debugging toggles such as `ONLY_WRITE_LOCAL_DATA_FILE`; treat those as local debugging switches, not user-facing configuration.

## When docs must be updated

- Update `API.md` whenever a public endpoint, request parameter, response shape, or caching rule changes.
- Update `README.md` when contributor-facing dataset fields or submission rules change.
- Regenerate `public/llms.txt` and `public/llms-full.txt` after changing `scripts/generate-llms.ts` or content it consumes.


# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ContentChef Node SDK — a Lerna monorepo with two packages:
- **`packages/contentchef-node`** — TypeScript client for the ContentChef content API (online + preview channels)
- **`packages/contentchef-media`** — Media URL generation utilities (wraps Cloudinary)

## Common Commands

All commands run from within a package directory (e.g., `packages/contentchef-node/`):

```bash
npm test              # clean + jest (with coverage)
npm run build         # clean + dual build (ESM → dist/esm, CJS → dist/cjs)
npm run lint          # eslint
npx jest --testPathPattern=<pattern>  # run a single test file
```

Monorepo install from root (npm workspaces, Lerna 8):
```bash
npm install           # installs all packages
npm run lint          # lerna run lint
npm test              # lerna run test
npm run build         # lerna run build
```

## Architecture

### contentchef-node

Entry point `src/index.ts` exports a `configure()` function that accepts `IContentChefConfiguration` (spaceId, API key, optional host/timeout) and returns an `IConfiguredSDK` with two channel factories:

- **`onlineChannel(apiKey, channel)`** — retrieves published content only
- **`previewChannel(apiKey, channel)`** — retrieves published + staging content, supports target dates via `ITargetDateResolver`

Each channel exposes: `content<T>()`, `search<T>()`, `localizedContent<T>()`, `localizedSearch<T>()`.

Key services:
- **ConfigurationManager** (`src/services/ConfigurationManager/`) — validates SDK config, implements `IConfigurable` to pass config to Channel
- **Channel** (`src/services/Channel/`) — builds API endpoints, executes fetch requests with `X-Chef-Key` header, serializes sorting/filtering

API endpoint patterns:
- Online: `/space/{spaceId}/online/{method}/{channel}`
- Preview: `/space/{spaceId}/preview/{state}/{method}/{channel}`

### contentchef-media

Thin wrapper around `cloudinary-build-url`. Exports `imageUrl()`, `videoUrl()`, `rawFileUrl()` with default cloud name `'contentchef'` and HTTPS enforced.

## Build Output

Both packages produce dual targets:
- `dist/cjs/` — CommonJS (main entry)
- `dist/esm/` — ES modules (module entry)
- `dist/index.d.ts` — TypeScript declarations

## Testing

- Jest with ts-jest, test files in `__tests__/` dirs using `.test.ts` or `.spec.ts` suffix
- HTTP mocking via `nock` (contentchef-node)
- Coverage collected automatically

## Linting

Uses ESLint (flat config at `eslint.config.mjs`) with `typescript-eslint`. Single quotes enforced, `no-empty-object-type` disabled, `ban-ts-comment` disabled in tests.

## PR Labels for Changelog

- `breaking` (💥), `enhancement` (🚀), `bug` (🐛), `documentation` (📝), `internal` (🏠)

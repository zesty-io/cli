# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run build      # Compile TypeScript to dist/, generate oclif manifest
npm run lint       # ESLint with oclif-recommended config
npm run test       # Mocha tests (60s timeout per test)
```

Run a single test file:
```bash
npx mocha --require ts-node/register test/commands/authenticated-command.test.ts
```

## Architecture

This is a Node.js CLI tool (`zesty`) built with the **oclif** framework for interacting with the Zesty.io CMS platform.

**Execution path:**
```
bin/run → oclif runtime → dist/commands/<topic>/<command>.ts → @zesty-io/sdk → Zesty.io APIs
```

**Command structure** follows oclif conventions with topic-prefixed commands (e.g., `zesty auth login`, `zesty instance list`). Source lives in `src/commands/`, compiled to `dist/commands/` which is what oclif actually runs.

**`AuthenticatedCommand`** ([src/authenticated-command.ts](src/authenticated-command.ts)) is the base class most commands extend. It reads the stored token from oclif's config directory (e.g., `~/.config/zesty/`), verifies it against the Zesty auth API, and initializes the `@zesty-io/sdk` client before the command's `run()` method executes.

**Commands:**
- `src/commands/auth/` — login, signup, get-user-token (these extend `Command` directly, not `AuthenticatedCommand`)
- `src/commands/instance/` — list, create instances
- `src/commands/init.ts` — interactive project initialization that orchestrates auth check + instance selection

## Key notes

- **Build before testing manually**: the oclif binary runs from `dist/`, not `src/`. Run `npm run build` after source changes to test the CLI end-to-end.
- **Node >= 22.16.0** is required (pinned via Volta in `package.json`).
- **README.md is auto-generated** by oclif from command docstrings — do not edit it manually.
- Tests use Mocha + Chai with `ts-node` so they run against TypeScript source directly (no build needed for `npm run test`).

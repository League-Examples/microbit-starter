---
sprint: "002"
status: draft
---
<!-- CLASI: Before changing code or making plans, review the SE process in CLAUDE.md -->

# Architecture Update -- Sprint 002: Template Cleanup & Configuration

## What Changed

### Files Removed (13 files)

**Source files (5):**
- `src/ir.ts` — NEC IR transmitter/receiver implementation
- `src/ir.cpp` — C++ hardware shims for IR timing
- `src/irpacket.ts` — IR packet data structures
- `src/lib.ts` — IR helper utilities
- `src/shims.ts` — IR simulator shim declarations

**Generated type declarations (2):**
- `shims.d.ts` — Auto-generated TypeScript declarations for IR C++ shims
- `enums.d.ts` — Auto-generated enum declarations for IR C++ enums

**Test files (3):**
- `test/testNec.ts` — NEC protocol tests
- `test/testIRPacket.ts` — IR packet tests
- `test/testPulse.ts` — Pulse timing tests

**Assets and docs (2):**
- `icon.png` — LeagueIR extension icon
- `DEVELOPMENT.md` — IR-specific development notes

**Build system (1):**
- `Makefile` (root) — Make-based build, replaced by npm scripts

### Files Added or Rewritten (5 files)

**`pxt.json` (rewritten):**
Transformed from LeagueIR extension config (`"name": "leagueir"`,
`"public": true`, IR file lists) to generic template config
(`"name": "my-robot"`, `"public": false`, `"files": ["README.md", "src/robot.ts"]`,
`"testFiles": ["src/main.ts", "test/test.ts"]`). Only dependency is `core`.

**`package.json` (rewritten):**
Stripped unnecessary dependencies (`jake`, `typings`). Sole dependency is
`pxt-microbit`. Defines six npm script stubs (`setup`, `build`, `deploy`,
`test`, `serve`, `clean`) as placeholders for Sprint 003.

**`tsconfig.json` (new):**
PXT-compatible TypeScript compiler options. Required for the PXT build
toolchain to function correctly.

**`.gitignore` (new or rewritten):**
Covers all PXT-generated artifacts: `built/`, `pxt_modules/`,
`node_modules/`, `.pxt/`, `*.hex`, `*.d.ts`, `.env`, `.DS_Store`.
The `*.d.ts` glob is intentional — PXT auto-generates `shims.d.ts` and
`enums.d.ts` when C++ is present, and these cause merge conflicts if
committed. Hand-authored `.d.ts` files (unlikely in this project) would
need `git add -f`.

**`.env.example` (new):**
Bridge configuration placeholders (`BRIDGE_URL`, `BRIDGE_KEY`) commented
out. Bare clones default to local USB deploy.

## Why

The repository must transition from a single-purpose IR extension to a
generic student robotics template. This sprint removes the domain-specific
content and establishes the configuration foundation that all subsequent
sprints build on:

- Sprint 003 (npm scripts) depends on `package.json` script definitions.
- Sprint 004 (demo program) depends on `pxt.json` file lists being
  correct and generic.
- Sprint 005 (Codespaces/Docker) depends on `.gitignore` and
  `package.json` being in place.
- Sprint 006 (docs/deploy) depends on `.env.example` and the clean
  repo state.

This is the "clear the ground" sprint that makes the repo usable as a
template.

## Impact on Existing Components

**`docker/` directory:** Untouched. The Docker build system for the
`pxt/yotta` ARM cross-compilation image is already generic enough. It
will be reviewed and documented in Sprint 005.

**`README.md`:** Listed in `pxt.json` `files` but not rewritten in this
sprint. Content remains from LeagueIR until Sprint 006 rewrites it. The
file must exist because `pxt.json` references it.

**`.claude/` directory:** Untouched. Skills and `CLAUDE.md` were created
in Sprint 001 and remain valid.

**`src/` and `test/` directories:** After deletion, these directories
will be empty (or may not exist). Sprint 004 populates them with
`src/main.ts`, `src/robot.ts`, and `test/test.ts`.

**Build system paradigm shift:** The project moves from Make-based builds
(root `Makefile`) to npm-script-based builds (`package.json` scripts).
The `docker/Makefile` is unaffected — it builds the Docker image, not
the project.

## Migration Concerns

None. This is a template repository with no deployed instances. The
transition from IR extension to generic template is a clean break with
no backward compatibility requirements.

Students who previously used the LeagueIR extension should continue
using the pre-template version of the repo (tagged or archived
separately). This template is for new projects only.

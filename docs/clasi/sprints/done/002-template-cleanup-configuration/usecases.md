---
status: draft
---
<!-- CLASI: Before changing code or making plans, review the SE process in CLAUDE.md -->

# Sprint 002 Use Cases

## SUC-002-01: Clean repo has no IR-specific code

Parent: (project-level requirement: Template Cleanup)

- **Actor**: Developer (sprint executor)
- **Preconditions**: Repository contains LeagueIR source files, tests,
  generated declarations, icon, docs, and root Makefile.
- **Main Flow**:
  1. Delete `src/ir.ts`, `src/ir.cpp`, `src/irpacket.ts`, `src/lib.ts`,
     `src/shims.ts`.
  2. Delete `shims.d.ts`, `enums.d.ts` from root.
  3. Delete `icon.png` from root.
  4. Delete `test/testNec.ts`, `test/testIRPacket.ts`, `test/testPulse.ts`.
  5. Delete `DEVELOPMENT.md` from root.
  6. Delete root `Makefile`.
  7. Commit all deletions.
- **Postconditions**: No file in the repository (outside `docs/` planning
  history) references LeagueIR, NEC infrared, or IR-specific identifiers.
  The `src/` and `test/` directories are empty (or contain only files
  created by other sprints).
- **Acceptance Criteria**:
  - [ ] All 13 files listed in the cleanup table are deleted
  - [ ] `git status` shows no untracked IR-related files
  - [ ] Grep for "leagueir" (case-insensitive) outside `docs/` returns
        zero matches

## SUC-002-02: pxt.json is generic template config

Parent: (project-level requirement: Template Cleanup)

- **Actor**: Developer (sprint executor)
- **Preconditions**: Old `pxt.json` configured as `"leagueir"` extension
  with `"public": true` and IR-specific file lists.
- **Main Flow**:
  1. Rewrite `pxt.json` with the exact content specified in
     `MbTemplateDesignV2.md`:
     - `"name": "my-robot"`
     - `"version": "0.1.0"`
     - `"description": "Micro:bit robotics project"`
     - `"dependencies": { "core": "*" }`
     - `"files": ["README.md", "src/robot.ts"]`
     - `"testFiles": ["src/main.ts", "test/test.ts"]`
     - `"public": false`
     - `"targetVersions": { "target": "8.0.13", "targetId": "microbit" }`
     - `"supportedTargets": ["microbit"]`
     - `"preferredEditor": "tsprj"`
  2. Commit the rewritten file.
- **Postconditions**: `pxt.json` is valid JSON matching the design spec.
  No IR references remain. The project name is `"my-robot"` and it is
  not publicly listed.
- **Acceptance Criteria**:
  - [ ] `pxt.json` parses as valid JSON
  - [ ] `"name"` is `"my-robot"`
  - [ ] `"public"` is `false`
  - [ ] `"files"` contains `["README.md", "src/robot.ts"]`
  - [ ] `"testFiles"` contains `["src/main.ts", "test/test.ts"]`
  - [ ] No IR-specific entries in `files`, `testFiles`, or `dependencies`

## SUC-002-03: gitignore covers all generated artifacts

Parent: (project-level requirement: Template Cleanup)

- **Actor**: Developer (sprint executor)
- **Preconditions**: Existing `.gitignore` may be missing or incomplete
  for PXT-generated artifacts.
- **Main Flow**:
  1. Write `.gitignore` with entries for: `built/`, `pxt_modules/`,
     `node_modules/`, `.pxt/`, `*.hex`, `*.d.ts`, `.env`, `.DS_Store`.
- **Postconditions**: All PXT build outputs, Node.js dependencies,
  auto-generated type declarations, hex binaries, environment secrets,
  and macOS metadata files are excluded from version control.
- **Acceptance Criteria**:
  - [ ] `.gitignore` exists in repo root
  - [ ] Contains entries for all 8 patterns listed in the design spec
  - [ ] `git status` does not show any `built/`, `pxt_modules/`, or
        `.pxt/` directories as untracked

## SUC-002-04: package.json has correct structure and dependencies

Parent: (project-level requirement: Template Cleanup)

- **Actor**: Developer (sprint executor)
- **Preconditions**: Old `package.json` has unnecessary dependencies
  (`jake`, `typings`) and IR-specific metadata.
- **Main Flow**:
  1. Rewrite `package.json` with:
     - Generic project name and description
     - `pxt-microbit` as sole dependency
     - npm script stubs for `setup`, `build`, `deploy`, `test`, `serve`,
       `clean` (placeholder commands until Sprint 003)
  2. Write `tsconfig.json` with PXT-compatible compiler options.
  3. Commit both files.
- **Postconditions**: `package.json` defines the six npm scripts and
  depends only on `pxt-microbit`. `tsconfig.json` exists with correct
  compiler settings.
- **Acceptance Criteria**:
  - [ ] `package.json` parses as valid JSON
  - [ ] Only `pxt-microbit` appears in `dependencies`
  - [ ] No `jake` or `typings` dependencies remain
  - [ ] Scripts `setup`, `build`, `deploy`, `test`, `serve`, `clean`
        are all defined
  - [ ] `tsconfig.json` parses as valid JSON

## SUC-002-05: .env.example provides bridge variable placeholders

Parent: (project-level requirement: Bridge Integration)

- **Actor**: Developer (sprint executor)
- **Preconditions**: No `.env.example` file exists in the repository.
- **Main Flow**:
  1. Create `.env.example` with `BRIDGE_URL` and `BRIDGE_KEY` as
     commented-out variables.
- **Postconditions**: Students see the available bridge configuration
  variables. Bare clones default to local deploy (no env vars active).
- **Acceptance Criteria**:
  - [ ] `.env.example` exists in repo root
  - [ ] Contains `BRIDGE_URL` variable (commented out)
  - [ ] Contains `BRIDGE_KEY` variable (commented out)
  - [ ] File includes brief comments explaining what the variables do

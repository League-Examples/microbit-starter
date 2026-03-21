---
id: "004"
title: "Demo Program & Tests"
status: planning
branch: sprint/004-demo-program-tests
use-cases:
  - SUC-004-01
  - SUC-004-02
  - SUC-004-03
  - SUC-004-04
---
<!-- CLASI: Before changing code or making plans, review the SE process in CLAUDE.md -->

# Sprint 004: Demo Program & Tests

## Goals

Write the three TypeScript source files that give the template its initial
content: a demo program showing micro:bit V2 capabilities, a starter robot
namespace with block annotations, and a minimal test exerciser. After this
sprint, a student who clones the template and runs `npm run build` gets a
working hex file, and the repo is safe to import as an extension without
pulling in the demo program.

## Problem

After Sprints 002 (cleanup/config) and 003 (build pipeline), the template
compiles but contains no source files. Students who clone the repo see an
empty project with nothing to deploy. There is no demo showing what the
micro:bit V2 can do, no scaffold for student code, and no test to verify
the robot namespace works.

## Solution

Create three files:

1. **`src/main.ts`** (listed in `testFiles`) -- A small demo program that
   exercises core V2 features: startup animation on the LED matrix, Button A
   plays a tone via the onboard speaker, Button B shows light level as a bar
   graph, touching the logo shows sound level, and shaking shows a compass
   arrow. This file is excluded when the repo is imported as an extension.

2. **`src/robot.ts`** (listed in `files`) -- A `robot` namespace with
   `//% color/weight/icon` annotations on the namespace and a single example
   function `driveForward(ms)` with a `//% block` annotation. The function
   body is a TODO placeholder (shows an arrow, pauses, clears screen). This
   teaches students the block annotation pattern and gives them a namespace
   to extend.

3. **`test/test.ts`** (listed in `testFiles`) -- A minimal exerciser that
   calls `robot.driveForward(500)`, writes a serial line confirming
   completion, and shows a checkmark icon. This validates that the robot
   namespace compiles and its exported functions are callable.

## Success Criteria

- `npm run build` completes without errors (hex file produced).
- `src/main.ts` is in `pxt.json` `testFiles`, not `files`.
- `src/robot.ts` is in `pxt.json` `files`.
- `test/test.ts` is in `pxt.json` `testFiles`.
- When the repo is added as an extension dependency by another project, only
  the `robot` namespace is included -- `main.ts` and `test.ts` are excluded.
- The `robot` namespace appears in the MakeCode Blocks editor with the
  configured color, icon, and the `driveForward` block.

## Scope

### In Scope

- `src/main.ts` -- demo program (V2 features: speaker, microphone, touch
  logo, LED, compass/accelerometer)
- `src/robot.ts` -- robot namespace with block annotations and example
  function
- `test/test.ts` -- minimal test exerciser for robot namespace
- Verification that `pxt.json` already has these files in the correct
  arrays (`files` and `testFiles`) from Sprint 002
- Build compilation check via `npm run build` from Sprint 003

### Out of Scope

- Changes to `pxt.json` (already configured in Sprint 002)
- Changes to build scripts (already implemented in Sprint 003)
- Real motor commands in `robot.ts` (placeholder only)
- Structured test framework / test helpers namespace (deferred per design doc)
- `.devcontainer`, Docker, or deploy script changes (Sprint 005/006)
- README or student-facing documentation

## Dependencies

- **Sprint 002 (Template Cleanup & Configuration):** Provides `pxt.json`
  with the `files`/`testFiles` arrays already listing `src/robot.ts`,
  `src/main.ts`, and `test/test.ts`. Also provides `tsconfig.json` and
  `.gitignore`.
- **Sprint 003 (npm Scripts & Build Pipeline):** Provides `npm run build`
  and `npm run test` commands used to verify compilation.

## Test Strategy

Testing is constrained by the hardware target -- there is no simulator-based
test runner. The strategy for this sprint:

1. **Build verification:** `npm run build` must succeed, producing a `.hex`
   file. This confirms all three files compile under Static TypeScript and
   that the `files`/`testFiles` split is correct.
2. **Import safety verification:** Create a temporary test project that adds
   this repo as an extension dependency and confirm that only `robot.ts` is
   compiled (not `main.ts` or `test.ts`). This can be checked by examining
   the PXT build output or by verifying that symbols from `main.ts` are not
   present.
3. **Manual on-device test (optional):** Deploy to a micro:bit V2 and
   confirm the demo program runs (heart icon on startup, buttons/logo/shake
   respond correctly).

## Architecture Notes

- **`files` vs `testFiles` split:** This is the core architectural concern.
  `robot.ts` is in `files` because it is library code that consumers need.
  `main.ts` and `test.ts` are in `testFiles` because they are application/
  test code that must not leak into extension consumers. PXT enforces this
  split at build time.
- **Block annotations:** The `//% color="#FF8000" weight=100 icon="\uf1b9"`
  annotation on the `robot` namespace and `//% block="drive forward for $ms ms"`
  on `driveForward` are teaching features. They make the robot namespace
  visible in the MakeCode Blocks editor. The repo has `"public": false` so
  it does not appear in the extension gallery.
- **Static TypeScript constraints:** All code must comply with STS
  restrictions -- no `async/await`, no `any`, no ES modules, no optional
  chaining. The demo program uses only MakeCode built-in APIs (`basic`,
  `input`, `music`, `led`).

## GitHub Issues

(None linked.)

## Definition of Ready

Before tickets can be created, all of the following must be true:

- [ ] Sprint planning documents are complete (sprint.md, use cases, architecture)
- [ ] Architecture review passed
- [ ] Stakeholder has approved the sprint plan

## Tickets

(To be created after sprint approval.)

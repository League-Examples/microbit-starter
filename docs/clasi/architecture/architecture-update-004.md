---
sprint: "004"
status: draft
---
<!-- CLASI: Before changing code or making plans, review the SE process in CLAUDE.md -->

# Architecture Update -- Sprint 004: Demo Program & Tests

## What Changed

Three new TypeScript source files are added to the repository:

### 1. `src/main.ts` (placement: `testFiles`)

The demo/application program. Contains top-level code (event handlers and
startup sequence) that runs when the project is built and deployed directly.

**Contents:**
- Startup animation: shows heart icon, pauses, clears screen.
- `input.onButtonPressed(Button.A)` -- plays a tone via the V2 speaker,
  shows happy face.
- `input.onButtonPressed(Button.B)` -- reads `input.lightLevel()`, displays
  as bar graph.
- `input.onLogoEvent(TouchButtonEvent.Pressed)` -- reads `input.soundLevel()`,
  displays as bar graph.
- `input.onGesture(Gesture.Shake)` -- shows north arrow briefly.

**Why in `testFiles`:** This file contains application-level code (event
handlers, top-level statements). If it were in `files`, any project that
imports this repo as an extension would inherit these event handlers. The
`testFiles` placement ensures it is compiled only for direct builds, not
when consumed as a dependency.

### 2. `src/robot.ts` (placement: `files`)

The library/namespace file. Contains the `robot` namespace with block
annotations and an example function.

**Contents:**
- `robot` namespace with annotations:
  `//% color="#FF8000" weight=100 icon="\uf1b9"`
- `robot.driveForward(ms: number): void` with annotation:
  `//% block="drive forward for $ms ms"`
- Function body is a placeholder: shows north arrow, pauses for `ms`,
  clears screen. Marked with TODO comment for real motor commands.

**Why in `files`:** This is library code. It must be available to extension
consumers. The block annotations make `robot.driveForward` appear in the
MakeCode Blocks editor under a "robot" category with orange color and car
icon.

### 3. `test/test.ts` (placement: `testFiles`)

Minimal test exerciser for the robot namespace.

**Contents:**
- Calls `robot.driveForward(500)`.
- `serial.writeLine("test: driveForward completed")` for serial output.
- Shows `IconNames.Yes` (checkmark) to indicate completion.

**Why in `testFiles`:** Test code must not ship to extension consumers.
It exercises the library but is not part of the library API.

## Why

The template needs initial content so students have something to deploy
immediately after setup. The demo program demonstrates V2 capabilities
(speaker, microphone, touch logo) that students may not know about. The
robot namespace scaffold teaches the block annotation pattern -- the main
"trick" of the PXT framework. The test file establishes the pattern for
validating namespace functions.

These three files correspond to the three roles in a PXT project:
- **Library code** (`files`) -- reusable, importable by others
- **Application code** (`testFiles`) -- runs only in direct builds
- **Test code** (`testFiles`) -- exercises library, excluded from consumers

## Impact on Existing Components

### pxt.json

No changes required. Sprint 002 already configured `pxt.json` with:

```json
{
    "files": [
        "README.md",
        "src/robot.ts"
    ],
    "testFiles": [
        "src/main.ts",
        "test/test.ts"
    ]
}
```

The files created in this sprint must match these paths exactly.

### Build pipeline

No changes to `scripts/build.js` or `scripts/deploy.js` (Sprint 003).
The build pipeline already handles the `files`/`testFiles` split via PXT's
built-in compilation model:
- `pxt build` compiles `files` + `testFiles` together (for direct builds).
- When imported as an extension, only `files` are compiled.

### Directory structure

Two new directories are created if they do not already exist:
- `src/` -- contains `main.ts` and `robot.ts`
- `test/` -- contains `test.ts`

### No new dependencies

All APIs used (`basic`, `input`, `music`, `led`, `serial`) are provided by
the `core` dependency already in `pxt.json`. No new PXT extensions or npm
packages are needed.

## The files/testFiles Split in Detail

This is the key architectural concept for this sprint. PXT's compilation
model works as follows:

```
Direct build (pxt build / npm run build):
  Compiles: files + testFiles
  Result: hex with library + application + tests

Extension import (another project adds this as dependency):
  Compiles: files ONLY
  Result: only library code is included
```

The split ensures:
1. Students get a full working program when they build their own project.
2. Other students who import this project as an extension get only the
   `robot` namespace -- no demo event handlers, no test code.
3. The `robot` namespace's block annotations work in both contexts.

## Migration Concerns

None. This sprint adds new files only. No existing files are modified.
No data migration. No backward compatibility issues.

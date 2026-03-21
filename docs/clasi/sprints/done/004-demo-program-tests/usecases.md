---
status: draft
---
<!-- CLASI: Before changing code or making plans, review the SE process in CLAUDE.md -->

# Sprint 004 Use Cases

## SUC-004-01: Student Sees Demo Running on Micro:bit After First Deploy

Parent: (none -- new use case for this sprint)

- **Actor**: Student
- **Preconditions**:
  - Student has cloned the template repo (via "Use this template" or git clone).
  - `npm run setup` has completed successfully (Sprint 003).
  - A micro:bit V2 is connected via USB or bridge is configured.
- **Main Flow**:
  1. Student runs `npm run deploy`.
  2. Build compiles `src/main.ts` (included via `testFiles`) along with
     `src/robot.ts` (from `files`).
  3. Hex file is flashed to the micro:bit.
  4. The micro:bit displays a heart icon for one second, then clears.
  5. Student presses Button A -- a tone plays through the speaker and a
     happy face appears.
  6. Student presses Button B -- the current light level is shown as a
     bar graph on the LED matrix.
  7. Student touches the logo -- the current sound level is shown as a
     bar graph.
  8. Student shakes the micro:bit -- a north arrow appears briefly.
- **Postconditions**:
  - Student has seen the micro:bit respond to multiple V2 inputs, confirming
    the board, toolchain, and deploy pipeline all work.
- **Acceptance Criteria**:
  - [ ] `npm run build` succeeds and produces a hex file
  - [ ] `src/main.ts` contains handlers for Button A (tone), Button B (light
    level), logo touch (sound level), and shake (compass arrow)
  - [ ] Startup animation shows a heart icon then clears

## SUC-004-02: Student Modifies robot.ts and Sees Changes in Blocks Editor

Parent: (none -- new use case for this sprint)

- **Actor**: Student
- **Preconditions**:
  - Template repo is set up and builds successfully.
  - Student opens the project in MakeCode (via `pxt serve` or imports the
    repo in the online editor).
- **Main Flow**:
  1. Student opens `src/robot.ts` and sees the `robot` namespace with the
     `driveForward` function.
  2. Student opens the MakeCode Blocks editor.
  3. The "robot" category appears in the block toolbox with the configured
     color (#FF8000) and car icon.
  4. The "drive forward for __ ms" block is available under the robot
     category.
  5. Student adds a new function to the `robot` namespace with a
     `//% block` annotation.
  6. Student rebuilds and sees the new block appear in the toolbox.
- **Postconditions**:
  - Student understands how `//% block` annotations map TypeScript functions
    to visual blocks and can extend the robot namespace.
- **Acceptance Criteria**:
  - [ ] `src/robot.ts` has `//% color="#FF8000" weight=100 icon="\uf1b9"` on
    the `robot` namespace
  - [ ] `driveForward` has `//% block="drive forward for $ms ms"` annotation
  - [ ] `robot.ts` is in `pxt.json` `files` (not `testFiles`)

## SUC-004-03: Student Imports Repo as Extension -- Only Robot Namespace Included

Parent: (none -- new use case for this sprint)

- **Actor**: Student (consumer of another student's repo)
- **Preconditions**:
  - Student A has a working project based on this template with custom
    functions in the `robot` namespace in `src/robot.ts`.
  - Student B wants to use Student A's robot functions in their own project.
- **Main Flow**:
  1. Student B adds Student A's GitHub repo URL as an extension dependency
     in their `pxt.json`.
  2. Student B runs `pxt install` to fetch the dependency.
  3. PXT compiles Student B's project. Only files listed in the dependency's
     `files` array are included -- `src/robot.ts`.
  4. Files in `testFiles` (`src/main.ts`, `test/test.ts`) are excluded.
  5. Student B can use `robot.driveForward()` and any other exported
     functions from the `robot` namespace.
  6. The demo program's event handlers (Button A tone, Button B light, etc.)
     do NOT run in Student B's project.
- **Postconditions**:
  - Student B's project includes only the library code (`robot` namespace),
    not the demo program or tests.
- **Acceptance Criteria**:
  - [ ] `src/main.ts` is in `pxt.json` `testFiles`, not `files`
  - [ ] `test/test.ts` is in `pxt.json` `testFiles`, not `files`
  - [ ] `src/robot.ts` is in `pxt.json` `files`
  - [ ] When imported as an extension, only `robot` namespace symbols are
    available to the consumer

## SUC-004-04: Test Exerciser Validates Robot Namespace Functions

Parent: (none -- new use case for this sprint)

- **Actor**: Developer (student or AI agent)
- **Preconditions**:
  - Template repo is set up and builds successfully.
  - `test/test.ts` exists in `pxt.json` `testFiles`.
- **Main Flow**:
  1. Developer runs `npm run test` (which compiles with `testFiles` included).
  2. PXT compiles `src/robot.ts` (from `files`) and `test/test.ts` (from
     `testFiles`) together.
  3. `test/test.ts` calls `robot.driveForward(500)`.
  4. The function executes: shows a north arrow, pauses 500ms, clears screen.
  5. `serial.writeLine("test: driveForward completed")` outputs to serial.
  6. A checkmark icon (`IconNames.Yes`) is shown on the LED matrix.
- **Postconditions**:
  - Build succeeded, confirming that `robot` namespace functions are callable
    from test files and the `files`/`testFiles` compilation model works.
- **Acceptance Criteria**:
  - [ ] `test/test.ts` calls `robot.driveForward()` and compiles without error
  - [ ] `test/test.ts` uses `serial.writeLine` to report test completion
  - [ ] `test/test.ts` shows `IconNames.Yes` (checkmark) on success
  - [ ] `npm run test` (or `npm run build`) completes without errors

# mb-template: Student Robotics Micro:bit Template

## Vision

A clean, ready-to-clone template repository for students building robotics
projects on the BBC Micro:bit using Microsoft MakeCode (PXT). Students clone
this repo, add the extensions their robot platform needs, and write TypeScript
(and optionally C++) to solve robotics challenges. An AI-assisted workflow
(Claude Code + CLAUDE.md) guides them through common tasks.

**Primary audience:** Students in a robotics league/course.
**Primary language:** TypeScript (MakeCode/Static TypeScript).
**Secondary language:** C++ (for hardware-level shims when needed).
**Not in scope:** MicroPython (completely different toolchain).

---

## What Exists Today

The repo is a working LeagueIR extension — an NEC-protocol infrared
transmitter/receiver for Micro:bit with:

- `src/ir.ts`, `src/ir.cpp` — IR send/receive with C++ shims
- `src/irpacket.ts` — custom packet format with CRC-8
- `src/lib.ts` — hex-conversion helper
- `src/shims.ts` — simulator fallbacks
- `src/main.ts` — empty entry point
- `test/` — hardware-in-the-loop IR tests
- `docker/` — yotta/ARM cross-compilation for local C++ builds
- `Makefile` — setup, build, deploy, test targets
- `pxt.json` — configured as "leagueir" extension
- `DEVELOPMENT.md` — dev setup notes (IR-specific)

All of this is IR-specific and needs to be either removed or generalized.

---

## Proposed Final Structure

```
mb-template/
├── CLAUDE.md                  # AI agent instructions for this repo
├── README.md                  # Student-facing: what this is, how to start
├── LICENSE
├── Makefile                   # setup, build, deploy, test, clean
├── pxt.json                   # Generic template config
├── tsconfig.json
├── package.json
│
├── src/
│   ├── main.ts                # Entry point — demo program
│   └── robot.ts               # Starter module — students build here
│
├── test/
│   └── test.ts                # Starter test file
│
├── docs/
│   ├── PLAN.md                # This file (remove after execution)
│   ├── getting-started.md     # Step-by-step: clone → build → flash
│   ├── adding-extensions.md   # How to bring in motor/sensor libraries
│   ├── typescript-guide.md    # MakeCode TS quirks & patterns
│   └── cpp-guide.md           # When and how to write C++ shims
│
├── docker/                    # Keep for local C++ compilation
│   ├── Dockerfile
│   ├── Makefile
│   └── README.md
│
└── .vscode/
    └── settings.json          # Editor config for PXT projects
```

### What Gets Removed

| Current File | Action | Reason |
|---|---|---|
| `src/ir.ts` | Delete | IR-specific |
| `src/ir.cpp` | Delete | IR-specific |
| `src/irpacket.ts` | Delete | IR-specific |
| `src/lib.ts` | Delete | IR-specific helper |
| `src/shims.ts` | Delete | IR-specific simulator shims |
| `shims.d.ts` | Delete | Auto-generated for IR C++ |
| `enums.d.ts` | Delete | Auto-generated for IR C++ |
| `icon.png` | Replace | LeagueIR icon → generic or remove |
| `test/testNec.ts` | Delete | IR-specific |
| `test/testIRPacket.ts` | Delete | IR-specific |
| `test/testPulse.ts` | Delete | IR-specific |
| `DEVELOPMENT.md` | Delete | Replaced by docs/ guides |
| `README.md` | Rewrite | Currently IR-specific |

### What Gets Created or Rewritten

| File | Purpose |
|---|---|
| `CLAUDE.md` | Agent instructions (see section below) |
| `README.md` | Template overview, quick start, link to docs/ |
| `pxt.json` | Renamed to generic project, minimal deps |
| `src/main.ts` | Demo: show LED pattern + button handling |
| `src/robot.ts` | Empty starter module with namespace scaffold |
| `test/test.ts` | Minimal test that exercises the demo |
| `Makefile` | Generalized build targets |
| `docs/getting-started.md` | Clone, setup, build, flash walkthrough |
| `docs/adding-extensions.md` | How to add deps to pxt.json |
| `docs/typescript-guide.md` | Static TS gotchas for students |
| `docs/cpp-guide.md` | C++ shim pattern reference |

---

## CLAUDE.md Design

The `CLAUDE.md` file will serve as the AI copilot's instruction manual for this
repo. It should cover:

### Project Context
- This is a MakeCode/PXT project targeting BBC Micro:bit
- Students use it for robotics challenges
- TypeScript is the primary language; C++ for hardware shims only

### Build & Deploy Commands
```
make setup    — install pxt + deps
make build    — compile to .hex
make deploy   — flash to connected Micro:bit
make test     — build + run test files
make clean    — remove built/ and pxt_modules/
```

### Key Conventions
- **Every source file must be listed in `pxt.json` `files` array** (this is
  the #1 thing AI agents get wrong with PXT projects)
- Test files go in `pxt.json` `testFiles` array
- TypeScript is "Static TypeScript" — no `any`, no `async/await`, no
  `Promise`, no `Map`/`Set`, no regex, no `JSON.parse`
- Namespaces are used instead of ES modules
- `//% block="..."` annotations define Blocks editor appearance
- `//% shim=ns::func` links TS functions to C++ implementations

### Common Student Tasks (agent should help with)
1. **Add an extension** — edit `pxt.json` dependencies, run `pxt install`
2. **Create a new source file** — create in `src/`, add to `pxt.json` files
3. **Write a function for a challenge** — use namespace pattern, respect STS limits
4. **Add a C++ shim** — `.cpp` file + shim annotation + `shims.d.ts` regen
5. **Debug serial output** — `serial.writeLine()` is the primary debug tool
6. **Flash to Micro:bit** — `make deploy` or copy `.hex` to /Volumes/MICROBIT

### What NOT to Do
- Don't use `import`/`export` (use namespaces)
- Don't suggest `async/await` or Promises
- Don't create files without adding them to `pxt.json`
- Don't suggest npm packages (only PXT extensions work)

---

## Demo Program Design

`src/main.ts` — A small, self-contained program that demonstrates core
Micro:bit capabilities students will use in robotics:

```typescript
// Show a startup animation on the LED matrix
basic.showIcon(IconNames.Heart)
basic.pause(1000)
basic.clearScreen()

// Button A: show a smiley
input.onButtonPressed(Button.A, function () {
    basic.showIcon(IconNames.Happy)
})

// Button B: show current light level as bar graph
input.onButtonPressed(Button.B, function () {
    let light = input.lightLevel()
    led.plotBarGraph(light, 255)
})

// Shake: show an arrow (useful for orientation demos)
input.onGesture(Gesture.Shake, function () {
    basic.showArrow(ArrowNames.North)
    basic.pause(500)
    basic.clearScreen()
})
```

`src/robot.ts` — Scaffold for student code:

```typescript
/**
 * Student robot functions. Add your challenge solutions here.
 */
//% color="#FF8000" weight=100 icon="\uf1b9"
namespace robot {

    /**
     * Example: drive forward for a duration.
     * Replace this with real motor commands once you add
     * your robot platform's extension.
     */
    //% block="drive forward for $ms ms"
    export function driveForward(ms: number): void {
        // TODO: Replace with actual motor commands
        basic.showArrow(ArrowNames.North)
        basic.pause(ms)
        basic.clearScreen()
    }
}
```

---

## pxt.json Template

```json
{
    "name": "my-robot",
    "version": "0.1.0",
    "description": "Micro:bit robotics project",
    "dependencies": {
        "core": "*"
    },
    "files": [
        "README.md",
        "src/main.ts",
        "src/robot.ts"
    ],
    "testFiles": [
        "test/test.ts"
    ],
    "public": false,
    "targetVersions": {
        "target": "8.0.13",
        "targetId": "microbit"
    },
    "supportedTargets": [
        "microbit"
    ],
    "preferredEditor": "tsprj"
}
```

Students rename `"name"` to their project name. Extensions get added to
`"dependencies"`. New source files get added to `"files"`.

---

## Makefile Targets

Generalize the existing Makefile:

| Target | Command | Description |
|---|---|---|
| `setup` | `npm install && pxt target microbit && pxt install` | One-time setup |
| `build` | `pxt build` | Compile to .hex |
| `deploy` | `pxt deploy` | Build + flash to Micro:bit |
| `test` | `pxt test` | Build with test files |
| `serve` | `pxt serve` | Open local MakeCode editor |
| `clean` | `rm -rf built/ pxt_modules/ node_modules/` | Full clean |

Remove the version-bumping / release / push targets (those are for extension
publishing, not student projects). Keep Docker targets if the docker/ directory
is retained.

---

## Documentation Plan

### docs/getting-started.md
1. Prerequisites: Node.js, USB cable, Micro:bit
2. Clone the template repo
3. `make setup`
4. `make build` — verify it compiles
5. Plug in Micro:bit, `make deploy`
6. See the heart icon, press buttons, shake it
7. Open `src/robot.ts`, start coding

### docs/adding-extensions.md
1. What extensions are (GitHub repos with pxt.json)
2. Finding extensions: MakeCode editor search, GitHub
3. Adding to `pxt.json` dependencies with the GitHub URL format
4. Running `pxt install` to fetch them
5. Example: adding servo, neopixel, or a motor driver
6. Common robotics extensions list with URLs

### docs/typescript-guide.md
1. What "Static TypeScript" means — the subset MakeCode supports
2. Things that won't work: `any`, `async/await`, `Promise`, `Map`, regex
3. Namespaces instead of modules
4. The `//% block` annotation system
5. Number types (integer on V1, float on V2)
6. `control.inBackground()` for concurrent tasks
7. Serial output for debugging

### docs/cpp-guide.md
1. When you need C++ (hardware timing, direct pin control)
2. The shim pattern: `.cpp` file + `//% shim=` annotation
3. Including `pxt.h`, using `getPin()`, pin API
4. Simulator fallbacks in the TS shim file
5. Auto-generated `shims.d.ts` and `enums.d.ts`
6. Local compilation with Docker/yotta
7. Example: a simple digital read/write shim

---

## Execution Order

1. **Create CLAUDE.md** — so the AI agent is immediately useful
2. **Clean out IR-specific code** — delete IR source, tests, generated files
3. **Rewrite pxt.json** — generic name, minimal deps, new file list
4. **Write demo program** — `src/main.ts` + `src/robot.ts`
5. **Write starter test** — `test/test.ts`
6. **Rewrite README.md** — template-focused, link to docs
7. **Generalize Makefile** — remove release targets, clean up
8. **Write docs/** — the four guide documents
9. **Clean up misc** — update .gitignore, remove icon.png or replace, update package.json
10. **Test the build** — `make setup && make build` to verify everything compiles

---

## Open Questions

1. **Keep docker/?** The Docker setup enables local C++ compilation without the
   cloud compiler. Useful if students write C++ shims, but adds complexity.
   Recommendation: keep it but document it as optional/advanced.

2. **Micro:bit V1 vs V2?** The current target version (8.0.13) supports both.
   V2 has floating point, speaker, microphone, touch. Should the demo use
   V2-only features? Recommendation: stick to V1-compatible features in the
   demo so it works on any Micro:bit.

3. **Should this be a GitHub template repo?** GitHub has a "template repository"
   feature that gives a "Use this template" button instead of requiring
   fork/clone. Recommendation: yes, enable it — it's just a repo setting.

4. **Extension publishing vs. student project?** The current repo is set up as a
   publishable extension (`"public": true`). Student projects should be
   `"public": false` and don't need the extension scaffolding (block
   annotations, etc.). However, keeping the `//% block` annotations in
   `robot.ts` lets students see their functions in the Blocks editor, which is
   a nice learning tool. Recommendation: keep `"public": false` but retain
   block annotations as a teaching feature.

5. **Package.json dependencies?** Currently lists `jake`, `pxt-microbit`, and
   `typings`. Only `pxt-microbit` is needed. Clean up the others.

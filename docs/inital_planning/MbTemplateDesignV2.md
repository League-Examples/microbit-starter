# mb-template: Student Robotics Micro:bit Template — Design Document V2

This document replaces `MbTemplatePlanV1.md`. All design decisions from prior
documents (template plan V1, use cases, bridge design V2, documentation sources)
are consolidated here. Where prior documents conflict, this one wins.

---

## Vision

A ready-to-clone GitHub template repository for students building robotics
projects on the BBC micro:bit V2 using Microsoft MakeCode (PXT). Students use
GitHub's "Use this template" feature to create their own repo, run one setup
command, and start writing TypeScript. An AI agent (Claude Code) guided by
project-local skills handles the framework's quirks so students focus on
robotics, not toolchain configuration.

**Audience:** Students in a robotics league/course.
**Primary language:** TypeScript (MakeCode Static TypeScript).
**Secondary language:** C++ (hardware-level shims via CODAL, when needed).
**Target hardware:** BBC micro:bit V2 exclusively. No V1 support.
**Target environments:** GitHub Codespaces (primary), local macOS, local Linux.
**Not in scope:** MicroPython, Windows, micro:bit V1.

---

## What Exists Today

The repo is a working LeagueIR extension — an NEC-protocol infrared
transmitter/receiver. Everything is IR-specific and needs to be removed or
generalized:

- `src/ir.ts`, `src/ir.cpp`, `src/irpacket.ts`, `src/lib.ts`, `src/shims.ts`
- `shims.d.ts`, `enums.d.ts` (auto-generated for IR C++)
- `test/testNec.ts`, `test/testIRPacket.ts`, `test/testPulse.ts`
- `icon.png` (LeagueIR icon)
- `DEVELOPMENT.md` (IR-specific dev notes)
- `README.md` (IR-specific)
- `Makefile` at root (replaced by npm scripts)
- `pxt.json` configured as "leagueir" extension with `"public": true`
- `package.json` with unnecessary deps (`jake`, `typings`)

The `docker/` directory (Dockerfile + Makefile for building the `pxt/yotta`
ARM cross-compilation image) is retained and generalized.

---

## Final Repository Structure

```
mb-template/
├── CLAUDE.md                              # Project identity, build commands,
│                                          #   pxt.json rules, deploy behavior,
│                                          #   pointers to skills
├── README.md                              # Student-facing: what this is,
│                                          #   quick start, "ask the AI agent"
├── LICENSE
├── pxt.json                               # Generic template config
├── tsconfig.json
├── package.json                           # npm scripts defined here
├── .gitignore
├── .env.example                           # Bridge config placeholders
│
├── src/
│   ├── main.ts                            # Demo program (listed in testFiles)
│   └── robot.ts                           # Starter namespace (listed in files)
│
├── test/
│   └── test.ts                            # Minimal exerciser
│
├── scripts/
│   ├── setup.js                           # npm run setup
│   ├── build.js                           # npm run build
│   └── deploy.js                          # npm run deploy
│
├── docker/
│   ├── Dockerfile                         # ARM cross-compilation image
│   ├── Makefile                           # Builds/tags as pxt/yotta
│   └── README.md
│
├── .claude/
│   └── skills/
│       ├── static-typescript/
│       │   └── SKILL.md                   # STS language constraints
│       └── pxt/
│           ├── SKILL.md                   # Framework patterns, annotations
│           └── references/
│               └── block-annotations.md   # Detailed //% reference
│
├── .devcontainer/
│   └── devcontainer.json                  # Codespaces configuration
│
└── .vscode/
    └── settings.json                      # Editor config for PXT projects
```

---

## Cleanup: What Gets Deleted

| File | Reason |
|---|---|
| `src/ir.ts` | IR-specific |
| `src/ir.cpp` | IR-specific |
| `src/irpacket.ts` | IR-specific |
| `src/lib.ts` | IR-specific helper |
| `src/shims.ts` | IR-specific simulator shims |
| `shims.d.ts` | Auto-generated for IR C++ |
| `enums.d.ts` | Auto-generated for IR C++ |
| `icon.png` | LeagueIR icon |
| `test/testNec.ts` | IR-specific |
| `test/testIRPacket.ts` | IR-specific |
| `test/testPulse.ts` | IR-specific |
| `DEVELOPMENT.md` | Replaced by CLAUDE.md + skills |
| `Makefile` (root) | Replaced by npm scripts |

---

## Key Design Decisions

### 1. npm scripts, not Make

All build/deploy operations are `npm run` commands backed by JS scripts in
`scripts/`. Node.js is already a hard dependency (PXT requires it). The scripts
have real error handling: check preconditions, give actionable messages, fail
cleanly. The agent calls scripts — it doesn't improvise command sequences.

```json
{
  "scripts": {
    "setup": "node scripts/setup.js",
    "build": "node scripts/build.js",
    "deploy": "node scripts/deploy.js",
    "test": "pxt test",
    "serve": "pxt serve",
    "clean": "rm -rf built/ pxt_modules/ node_modules/ .pxt/"
  }
}
```

`pxt serve` (local MakeCode editor) stays because it's free — just a
passthrough to PXT. We don't document it prominently; it's there if someone
wants it.

The `docker/Makefile` inside the `docker/` directory is retained — it's the
build system for the cross-compilation Docker image, not the project build.

### 2. V2 only

Students have micro:bit V2 boards. The demo program uses V2 features (speaker,
microphone, touch logo). Build configuration sets
`PXT_COMPILE_SWITCHES=csv---mbcodal` to skip the V1/DAL build path entirely,
eliminating the need for yotta.

### 3. `main.ts` in testFiles

`main.ts` (the demo/application program) is listed in pxt.json `testFiles`, not
`files`. This makes the repo import-safe by default: when another student adds
this project as an extension dependency, only the library code in `files` runs.
The application code is excluded automatically.

This matters because students will import each other's repos as extensions. If
`main.ts` were in `files`, every consumer would inherit the demo program.

### 4. Bridge integration via environment variables

The deploy script reads two env vars to decide how to deliver the hex file:

```
BRIDGE_URL=https://bridge.example.com
BRIDGE_KEY=a3f1b2c9
```

**If both are set:** POST the hex to `${BRIDGE_URL}/api/hex` with
`Authorization: ${BRIDGE_KEY}` header, body is raw hex bytes.

**If either is missing:** Fall back to `pxt deploy` (local USB flash).

The script prints which path it took. `.env.example` ships in the repo with
the variables commented out so bare clones default to local deploy.

The bridge is a separate service (separate repo, separate deployment). The
template contains only the client-side integration: reading env vars and
POSTing the hex. The specific env var names and POST format are a contract
between the two projects — finalized when the bridge reaches implementation.

### 5. Docker image for C++ compilation

The `docker/` directory builds a Docker image tagged `pxt/yotta` containing
`gcc-arm-none-eabi`, `cmake`, `ninja`, `python3`, and `srec_cat`. PXT invokes
this image automatically when the project contains `.cpp` files and
`PXT_NODOCKER` is not set.

The image name `pxt/yotta` is a local convention set in `docker/Makefile`. The
build scripts reference this same name when checking for the image. If we later
push to a registry (for faster Codespace setup), we update both the Makefile
and the image reference.

Build environment variables set by default:

```
PXT_FORCE_LOCAL=1                    # No cloud compiler
PXT_COMPILE_SWITCHES=csv---mbcodal   # V2 only, skip V1/yotta
```

### 6. AI agent expertise lives in skills, not docs

There is no `docs/` directory. The AI agent (Claude Code) is the primary way
students get help. Expertise is structured as Claude Code skills in
`.claude/skills/`. The README covers only setup and "ask the agent."

### 7. GitHub template repository

The repo is configured as a GitHub template repository. Students click
"Use this template" instead of forking/cloning. This gives them a clean repo
with no fork relationship and no shared commit history.

---

## pxt.json

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
        "src/robot.ts"
    ],
    "testFiles": [
        "src/main.ts",
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

`"public": false` — this is a student project, not a published extension.
Block annotations are retained in `robot.ts` as a teaching feature (students
can see their functions in the Blocks editor) but the repo doesn't appear in
the MakeCode extension gallery.

Students rename `"name"` to their project name (scripted via
`npm run setup` or handled by the agent). Extensions go in `"dependencies"`.
New source files go in `"files"`.

---

## .gitignore

```
built/
pxt_modules/
node_modules/
.pxt/
*.hex
*.d.ts
.env
.DS_Store
```

The `*.d.ts` entry covers `shims.d.ts` and `enums.d.ts` (auto-generated by PXT
when C++ is present). If someone hand-authors a `.d.ts` file (unlikely), they
force-add it. The tradeoff is worth it — generated `.d.ts` files cause confusing
merge conflicts if committed.

---

## .devcontainer/devcontainer.json

```jsonc
{
    "name": "micro:bit Development",
    "image": "mcr.microsoft.com/devcontainers/javascript-node:22",

    "features": {
        "ghcr.io/devcontainers/features/docker-in-docker:2": {}
    },

    "postCreateCommand": "npm run setup",

    "forwardPorts": [8081],
    "portsAttributes": {
        "8081": {
            "label": "micro:bit Bridge (local)",
            "onAutoForward": "ignore"
        }
    },

    "customizations": {
        "vscode": {
            "settings": {
                "editor.tabSize": 4,
                "files.exclude": {
                    "built/": true,
                    "pxt_modules/": true,
                    ".pxt/": true
                }
            }
        }
    }
}
```

**Base image:** Node.js 22 devcontainer. No custom Dockerfile — the
Docker-in-Docker feature is added as a devcontainer feature.

**`postCreateCommand`:** Runs `npm run setup`, which must be idempotent. It
does: `npm install`, `pxt target microbit`, `pxt install`, and conditionally
builds the `pxt/yotta` Docker image if it doesn't exist. First Codespace
creation is slow (Docker image build); subsequent opens are fast.

**Docker layer cache persistence:** The Docker layer cache persists across
Codespace stop/start but not across rebuild. If this proves painful (students
rebuilding Codespaces frequently), we push `pxt/yotta` to GitHub Container
Registry and pull instead of building locally.

**Port 8081:** Reserved for local bridge development/testing. Not used in
normal operation since the bridge is an external service. `onAutoForward` is
set to `ignore` so VS Code doesn't prompt about it.

---

## Demo Program

### src/main.ts (in testFiles)

A small program demonstrating core micro:bit V2 capabilities:

```typescript
// Startup animation
basic.showIcon(IconNames.Heart)
basic.pause(1000)
basic.clearScreen()

// Button A: play a tone (V2 speaker)
input.onButtonPressed(Button.A, function () {
    music.playTone(262, music.beat(BeatFraction.Whole))
    basic.showIcon(IconNames.Happy)
})

// Button B: show light level as bar graph
input.onButtonPressed(Button.B, function () {
    let light = input.lightLevel()
    led.plotBarGraph(light, 255)
})

// Touch logo (V2): show sound level
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    let sound = input.soundLevel()
    led.plotBarGraph(sound, 255)
})

// Shake: show compass heading as arrow
input.onGesture(Gesture.Shake, function () {
    basic.showArrow(ArrowNames.North)
    basic.pause(500)
    basic.clearScreen()
})
```

### src/robot.ts (in files)

Scaffold for student code, with block annotations as a teaching feature:

```typescript
/**
 * Student robot functions. Add your challenge solutions here.
 */
//% color="#FF8000" weight=100 icon="\uf1b9"
namespace robot {

    /**
     * Example: drive forward for a duration.
     * Replace with real motor commands once you add
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

### test/test.ts (in testFiles)

```typescript
// Minimal test exerciser for the robot namespace.
// Run via: npm run test
robot.driveForward(500)
serial.writeLine("test: driveForward completed")
basic.showIcon(IconNames.Yes)
```

---

## Scripts

All in `scripts/`. JS files, not shell scripts. Each checks preconditions and
gives actionable error messages on failure.

### scripts/setup.js

1. `npm install`
2. `pxt target microbit`
3. `pxt install`
4. Check for `.cpp` files in `pxt.json` `files` — if present, check for
   `pxt/yotta` Docker image. If missing, run `cd docker && make` to build it.
5. Each step reports success/failure independently. Partial failures are
   identified clearly.

Must be idempotent — safe to run multiple times (Codespace `postCreateCommand`
runs it on every creation).

### scripts/build.js

1. Set environment: `PXT_FORCE_LOCAL=1`, `PXT_COMPILE_SWITCHES=csv---mbcodal`
2. Run `pxt build`
3. Report hex file location and size on success
4. If `.cpp` files are present and the `pxt/yotta` Docker image is missing,
   error with: "C++ compilation requires the Docker image. Run `npm run setup`."

### scripts/deploy.js

1. Run `scripts/build.js` (build first)
2. Read `BRIDGE_URL` and `BRIDGE_KEY` from environment / `.env`
3. If both present: POST hex to `${BRIDGE_URL}/api/hex` with
   `Authorization: ${BRIDGE_KEY}` header
4. If either missing: run `pxt deploy` (local USB flash)
5. Print which deploy path was used

---

## Claude Code Integration

### CLAUDE.md (project root)

Thin routing document. Contains:

1. **Project identity.** One paragraph: what this repo is, who it's for, that
   it targets micro:bit V2 via MakeCode/PXT, that TypeScript is primary and
   C++ is for hardware shims only.

2. **Build commands.**
   - `npm run setup` — one-time setup (installs PXT, target, deps, optionally
     Docker image)
   - `npm run build` — compile to .hex
   - `npm run deploy` — build + flash (bridge or local)
   - `npm run test` — build with testFiles included
   - `npm run clean` — remove built/, pxt_modules/, node_modules/, .pxt/

3. **pxt.json rules.** Every `.ts` file in `src/` must be in the `files` array.
   Every `.ts` file in `test/` and `src/main.ts` must be in `testFiles`. Every
   `.cpp` file must be in `files`. Creating a file without updating `pxt.json`
   means the file is silently ignored — this is the single most common agent
   error. Always do both in the same operation.

4. **Deploy behavior.** If `BRIDGE_URL` and `BRIDGE_KEY` are set (in `.env` or
   environment), deploy POSTs hex to the bridge. Otherwise falls back to
   `pxt deploy`.

5. **Pointers to skills.** "When writing TypeScript, consult
   `.claude/skills/static-typescript/`. When working with block annotations,
   C++ shims, namespaces, or extension structure, consult `.claude/skills/pxt/`."

6. **What not to do.** Don't suggest npm packages (only PXT extensions work).
   Don't use ES modules. Don't suggest MicroPython. Don't create files without
   updating pxt.json. Don't suggest the MakeCode cloud compiler.

### .claude/skills/static-typescript/SKILL.md

```yaml
---
name: static-typescript
description: >
  Static TypeScript language constraints for MakeCode/PXT micro:bit
  projects. Use this skill whenever writing, reviewing, or debugging
  TypeScript in this project, or when a student's code produces a
  confusing compiler error. All TypeScript in this project is Static
  TypeScript — a restricted subset. Many standard TypeScript features
  are unavailable and will cause build failures.
---
```

Body content (high-level outline, fleshed out during implementation):

- **Disallowed features:** `any`, `async`/`await`, `Promise`, `Map`/`Set`/
  `WeakMap`/`WeakSet`, regex literals, `JSON.parse`/`JSON.stringify`,
  `for...of` on non-array types, optional chaining (`?.`), nullish coalescing
  (`??`), ES module `import`/`export`, template literal types, `typeof` in
  type position, `keyof`, mapped types, conditional types, `Partial`/
  `Required`/`Readonly` utility types.
- **What to use instead:** Namespaces (not modules). `control.inBackground()`
  (not async). Manual type checks (not `any`). Array iteration via `for` loop
  or `.forEach()`.
- **Number types on V2:** Floating point is supported. Integer-only arithmetic
  is V1.
- **Common error messages mapped to STS causes.** (The cryptic ones that waste
  student time.)

### .claude/skills/pxt/SKILL.md

```yaml
---
name: pxt
description: >
  MakeCode/PXT framework patterns for micro:bit development. Use
  when working with block annotations (//%), C++ shims (//% shim=),
  namespace conventions, pxt.json configuration, extension authoring,
  the files/testFiles split, or when a student asks how to make
  something show up as a block in the MakeCode editor. Also use when
  a student wants to share their code as an importable extension.
---
```

Body content (high-level outline):

- **Namespace convention.** All student code goes in namespaces. The `robot`
  namespace is the default; students add more as needed. No top-level code
  in library files (only in `main.ts`/test files).
- **Block annotations.** `//% block="..."` syntax, `blockId`, `weight`,
  `group`, `color`, `icon`. Short reference in SKILL.md; detailed spec
  in `references/block-annotations.md`.
- **C++ shim pattern.** `.cpp` file with `//%` comment on the function →
  TS declaration with `//% shim=namespace::function` → simulator fallback
  in the TS body. Parameter type mapping (`int` ↔ `number`, `String` ↔
  `string`). The namespace and function name must exactly match.
- **files vs testFiles.** `files` = always compiled (library mode and direct
  build). `testFiles` = only compiled for direct builds, excluded when imported
  as a dependency. `main.ts` goes in `testFiles`.
- **Extension authoring.** How to structure a repo so classmates can import it.
  `"public": false` is fine for classroom use — import by GitHub URL. The
  `testDependencies` field.

### .claude/skills/pxt/references/block-annotations.md

Detailed reference for all `//% ` annotation options. Loaded by the agent only
when actively working on block definitions. Content drawn from
https://makecode.com/defining-blocks — reformatted as a scannable reference
with examples.

---

## Radio Debugging

Not part of this template. The radio debug workflow (sending debug strings from
an untethered robot to a tethered base station micro:bit) is handled on the
bridge side. From the template's perspective:

- The bridge tells the student what radio channel and group to configure.
- The student's code calls `radio.setGroup(n)` and `radio.sendString(msg)`.
- The bridge's serial terminal displays the relayed output.

No radio debug module, extension, or code ships in the template.

---

## Open Items

1. **Script implementation details.** The scripts in `scripts/` are specified
   at the behavioral level above. Exact implementation happens during
   execution. Error handling patterns, argument parsing, and `.env` loading
   library choice are decided then.

2. **Docker image registry.** If Codespace rebuilds prove slow due to
   rebuilding the `pxt/yotta` image, push it to GitHub Container Registry
   and pull instead of building locally. Decision deferred until we observe
   actual rebuild frequency.

3. **Test skeleton.** A structured `testHelpers` namespace with `pass(name)`,
   `fail(name, reason)`, `assertEqual(name, actual, expected)` functions that
   output structured serial messages. Deferred — test files for these devices
   tend to be ad hoc due to space constraints. Build it if a pattern emerges.

4. **Skill content.** The two skills (static-typescript, pxt) are outlined
   above at the section level. Full content is written during implementation
   with the actual constraint lists, error message mappings, and code examples.

5. **`targetVersions` in pxt.json.** The current value (`"target": "8.0.13"`)
   may need updating to the latest MakeCode micro:bit release at implementation
   time.

---

## Execution Order

1. **Create `.claude/` directory and skills** — so the agent is useful
   immediately during subsequent steps
2. **Write CLAUDE.md** — project identity and build commands
3. **Clean out IR-specific code** — delete all files listed in cleanup table
4. **Write pxt.json** — generic config per spec above
5. **Write package.json** — npm scripts, minimal deps (`pxt-microbit` only)
6. **Write demo program** — `src/main.ts` + `src/robot.ts`
7. **Write starter test** — `test/test.ts`
8. **Write scripts/** — setup.js, build.js, deploy.js
9. **Write README.md** — setup instructions, quick start, "ask the agent"
10. **Write .gitignore, .env.example, tsconfig.json**
11. **Write .devcontainer/devcontainer.json**
12. **Write .vscode/settings.json**
13. **Generalize docker/** — update README, verify Dockerfile is generic
14. **Test the build** — `npm run setup && npm run build` in a clean
    environment to verify everything compiles
15. **Enable GitHub template repository setting**

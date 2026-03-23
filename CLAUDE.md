
## Project Identity

This is a **micro:bit V2 MakeCode/PXT extension template** for student
robotics projects at The League of Amazing Programmers. Students write
TypeScript (Static TypeScript subset) as the primary language, with C++
used only for hardware shims that require direct DAL access. The repo is
structured as a PXT extension that students can import into their own
MakeCode projects via GitHub URL.

## Build Commands

| Command | What it does |
|---|---|
| `npm run setup` | Install npm deps, PXT target, and extension deps |
| `npm run build` | Compile the project locally to `.hex` |
| `npm run deploy` | Build and flash to connected micro:bit |
| `npm run test` | Build with test files included |
| `npm run lint` | Verify all source files are listed in pxt.json |
| `npm run serve` | Start the local MakeCode dev server |
| `npm run clean` | Remove built/, pxt_modules/, node_modules/, .pxt/ |

All build commands set `PXT_FORCE_LOCAL=1` to use the local compiler.

## pxt.json Rules

`pxt.json` is the project manifest. **Every source file must be
registered or PXT silently ignores it.**

- Every `.ts` file in `src/` must be listed in the `files` array.
- Every `.cpp` file must be listed in the `files` array.
- Every `.ts` file in `test/` must be listed in the `testFiles` array.
- `src/main.ts` (if it exists) goes in `testFiles`, not `files`, because
  it is the test entry point.
- `README.md`, `shims.d.ts`, and `enums.d.ts` go in `files`.

**Creating a file without adding it to `pxt.json` means the file is
silently ignored by the compiler.** No error, no warning — just missing
code.

## Deploy Behavior

If the environment variables `BRIDGE_URL` and `BRIDGE_KEY` are set,
deploy POSTs the compiled `.hex` file to the bridge endpoint. Otherwise,
`pxt deploy` flashes directly to a USB-connected micro:bit.

## Bridge Console

The bridge config is in `pxt.json` under `"bridge"`:

```json
"bridge": {
    "url": "http://localhost:5173/s/<session>",
    "devices": {
        "robot": "guvov",
        "base": "c7141e"
    }
}
```

- `url` — Fetch this to get API docs with all endpoints and the session
  key embedded in paths.
- `devices` — Maps short names to device identifiers. Values can be
  either a device name from the announcement protocol (e.g., `guvov`)
  or the last 6 hex digits of the device serial number (e.g., `c7141e`).

### Device Lookup

When the stakeholder says "deploy to robot":

1. Read `pxt.json` `bridge.devices` to resolve `robot` → `guvov`.
2. Fetch the bridge URL to get API docs.
3. `GET .../devices` to list connected devices.
4. Match the value (`guvov`) against device names. If no name match,
   match against the last 6 characters of device IDs (for serial
   number references like `c7141e`).
5. Use the matched device's full ID for targeted API calls.

**Always list devices and ask the stakeholder which one** before
deploying if the short name is not already specified. Do not broadcast
to all devices.

### Device Announcement Protocol

Programs should emit a device announcement line on startup via serial:
```
DEVICE:<type>:<commonName>:<machineUniqueId>:<deviceName>:<serial>
```
The console scans the first ~2000 characters of serial output for this
pattern and uses it to label the device. Fields:

- `type` — device role (e.g., `ROBOT`, `RADIOBRIDGE`, `SENSOR`)
- `commonName` — application-assigned name (e.g., `classroom-bot-1`)
- `machineUniqueId` — from `control.deviceSerialNumber()`
- `deviceName` — 5-char hardware name from `control.deviceName()`
- `serial` — full 48-char DAPLink USB serial (leave empty if unknown)

Example:
```typescript
let mid = control.deviceSerialNumber().toString()
let hwName = control.deviceName()
serial.writeLine("DEVICE:ROBOT:my-robot:" + mid + ":" + hwName + ":")
```

## Skill Pointers

- **When writing TypeScript**, consult `.claude/skills/static-typescript/`
  for language subset rules and disallowed features.
- **When working with block annotations, C++ shims, namespaces, or
  extension structure**, consult `.claude/skills/pxt/`.

## What Not to Do

- **Do not suggest npm packages.** Only PXT extensions (added via
  `pxt.json` `dependencies`) are supported.
- **Do not use ES modules** (`import`/`export`). Use `namespace` blocks.
- **Do not suggest MicroPython.** This project is TypeScript-only.
- **Do not create files without updating `pxt.json`.** The file will be
  silently ignored.
- **Do not suggest the cloud compiler.** All builds use the local
  compiler (`PXT_FORCE_LOCAL=1`).

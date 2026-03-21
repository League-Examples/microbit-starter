---
sprint: "005"
status: draft
---
<!-- CLASI: Before changing code or making plans, review the SE process in CLAUDE.md -->

# Architecture Update -- Sprint 005: Codespaces & Docker

## What Changed

### New: `.devcontainer/devcontainer.json`

A devcontainer configuration file is added to enable GitHub Codespaces
support. Structure:

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

Key design decisions:

- **Base image:** `mcr.microsoft.com/devcontainers/javascript-node:22`.
  No custom Dockerfile for the devcontainer. Node.js 22 is required by
  PXT. Using Microsoft's official image ensures compatibility with
  Codespaces infrastructure and automatic security updates.

- **Docker-in-Docker feature:** Added via the devcontainers features
  mechanism (`ghcr.io/devcontainers/features/docker-in-docker:2`). This
  makes the `docker` CLI available inside the Codespace container so
  that `scripts/setup.js` can build the `pxt/yotta` cross-compilation
  image when C++ files are present. This is a feature overlay, not a
  sidecar or socket mount.

- **postCreateCommand:** Delegates to `npm run setup` (Sprint 003's
  `scripts/setup.js`). This is the single entry point for environment
  setup. The script is idempotent -- safe to run on every Codespace
  creation. It handles: `npm install`, `pxt target microbit`,
  `pxt install`, and conditional Docker image build. No setup logic
  lives in devcontainer.json itself.

- **Port 8081:** Reserved for local bridge development and testing. Set
  to `onAutoForward: ignore` so VS Code does not prompt the student
  about an unused port during normal development. The bridge is an
  external service; this port is only relevant when running a local
  bridge instance for testing.

- **VS Code settings in devcontainer:** `files.exclude` hides `built/`,
  `pxt_modules/`, and `.pxt/` from the file explorer. These are
  generated directories that would confuse students. The `editor.tabSize`
  is set to 4 to match the PXT convention.

### Modified: `.vscode/settings.json`

The existing settings file is updated to add `files.exclude` entries
matching the devcontainer settings:

- `"built/"`: PXT build output directory
- `"pxt_modules/"`: PXT dependency modules (analogous to node_modules)
- `".pxt/"`: PXT internal cache directory

The existing `files.watcherExclude` and `search.exclude` entries already
cover these directories. The `editor.tabSize: 4` setting is added for
consistency with the devcontainer settings. The existing
`files.associations`, `C_Cpp.errorSquiggles`, and `editor.formatOnType`
settings are preserved.

### Modified: `docker/README.md`

Rewritten to describe the Docker image generically as a PXT/CODAL ARM
cross-compilation image for BBC micro:bit V2. All references to
"LeagueIR", "leaguepulse/yotta", and IR-specific integration are removed.
The README explains:

- What the image contains (gcc-arm-none-eabi, cmake, ninja, python3,
  srec_cat, yotta)
- How to build it (`cd docker && make build`)
- That `npm run setup` builds it automatically when C++ files are present
- That PXT uses the image automatically for C++ compilation
- The available Make targets

### Modified: `docker/Makefile`

The image name is updated from `pext/yotta` to `pxt/yotta` to match the
design document convention and the name that `scripts/setup.js` checks
for. This is a one-line change to the `IMAGE_NAME` variable.

### Unchanged: `docker/Dockerfile`

The Dockerfile is already generic. It installs Ubuntu 20.04 with
gcc-arm-none-eabi, cmake, ninja-build, srecord, python3, and yotta. No
LeagueIR-specific content exists in the Dockerfile. No changes needed.

## Why

The project design specifies GitHub Codespaces as the primary development
environment (Design Document V2, "Target environments"). Students need a
zero-configuration path from "Use this template" to a working build
environment. Without the devcontainer, students opening a Codespace get
a generic environment that requires manual Node.js version management,
manual PXT installation, and no Docker support for C++ compilation.

The Docker directory generalization removes the last LeagueIR-specific
artifacts from the repository, completing the template conversion that
began in Sprint 002.

## Impact on Existing Components

- **`scripts/setup.js` (Sprint 003):** No changes to the script itself.
  The devcontainer's `postCreateCommand` calls `npm run setup`, which
  invokes this script. The script must be idempotent and handle the case
  where Docker-in-Docker is available but the `pxt/yotta` image has not
  been built yet. The Makefile image name change from `pext/yotta` to
  `pxt/yotta` must match whatever name `setup.js` checks for.

- **`.vscode/settings.json`:** Existing settings are preserved. New
  `files.exclude` entries are additive. No breakage to existing local
  development workflows.

- **`docker/Makefile`:** The image name change from `pext/yotta` to
  `pxt/yotta` means any locally cached images under the old name will
  not be found. Running `npm run setup` or `cd docker && make build`
  will rebuild under the new name. This is a one-time cost.

## Migration Concerns

- Students who have already built the Docker image under the old
  `pext/yotta` name will need to rebuild under `pxt/yotta`, or manually
  retag: `docker tag pext/yotta:latest pxt/yotta:latest`. Since the
  template is not yet in student use, this is not a practical concern.
- The Docker layer cache in Codespaces persists across stop/start but
  not across rebuild. If students frequently rebuild Codespaces, the
  Docker image build adds several minutes to setup. Pushing to GitHub
  Container Registry is deferred until this is observed as a real
  problem (noted in Design Document V2, Open Items).

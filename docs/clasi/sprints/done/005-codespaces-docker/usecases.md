---
status: draft
---
<!-- CLASI: Before changing code or making plans, review the SE process in CLAUDE.md -->

# Sprint 005 Use Cases

## SUC-005-01: Student opens repo in Codespace and environment auto-configures
Parent: UC-006 (Codespaces support)

- **Actor**: Student
- **Preconditions**:
  - Student has a GitHub account with Codespaces access.
  - The repository has been created from the template (or is the template itself).
  - Sprint 003 deliverables are in place (`npm run setup` works).
- **Main Flow**:
  1. Student clicks "Code > Open with Codespaces > New codespace" on GitHub.
  2. GitHub provisions a Codespace using `.devcontainer/devcontainer.json`.
  3. The base image (Node.js 22) is pulled and the container starts.
  4. The Docker-in-Docker feature activates, making `docker` available inside the container.
  5. `postCreateCommand` runs `npm run setup`, which installs npm dependencies, sets the PXT target to microbit, runs `pxt install`, and conditionally builds the Docker image if C++ files are present.
  6. VS Code opens with build artifact directories hidden from the file explorer.
  7. The student sees a clean workspace with only source files visible.
- **Postconditions**:
  - Node.js 22 is available.
  - PXT CLI is installed and configured for microbit.
  - `npm run build` succeeds without further setup.
  - Docker is available for C++ compilation if needed.
- **Acceptance Criteria**:
  - [ ] `.devcontainer/devcontainer.json` exists and is valid JSON.
  - [ ] Codespace creation completes without errors.
  - [ ] `node --version` reports v22.x in the Codespace terminal.
  - [ ] `npm run build` succeeds in a fresh Codespace.
  - [ ] `docker --version` succeeds in the Codespace terminal.

## SUC-005-02: Student with C++ extension gets Docker image built automatically
Parent: UC-008 (Docker for C++ compilation)

- **Actor**: Student (advanced, adding C++ shims)
- **Preconditions**:
  - Student has added a `.cpp` file to `src/` and listed it in `pxt.json` `files`.
  - The Codespace has Docker-in-Docker available.
  - `scripts/setup.js` is implemented with conditional Docker image building.
- **Main Flow**:
  1. Student runs `npm run setup` (or it runs automatically on Codespace creation).
  2. `setup.js` detects `.cpp` files listed in `pxt.json`.
  3. `setup.js` checks for the `pxt/yotta` Docker image locally.
  4. Image is not found; `setup.js` runs `cd docker && make` to build it.
  5. The Docker image builds with gcc-arm-none-eabi, cmake, ninja, python3, and srec_cat.
  6. Student runs `npm run build`.
  7. PXT detects C++ files, finds the `pxt/yotta` image, and cross-compiles inside the container.
- **Postconditions**:
  - The `pxt/yotta` Docker image exists locally.
  - C++ compilation succeeds inside the Docker container.
  - The resulting .hex file includes both TypeScript and C++ components.
- **Acceptance Criteria**:
  - [ ] `docker/Makefile` tags the image as `pxt/yotta:latest`.
  - [ ] `docker/Dockerfile` installs gcc-arm-none-eabi, cmake, ninja, python3, srec_cat.
  - [ ] `docker/README.md` describes the image generically (no LeagueIR references).
  - [ ] The image name in `docker/Makefile` matches what `scripts/setup.js` checks for.

## SUC-005-03: VS Code hides build artifacts from file explorer
Parent: UC-006 (Codespaces support)

- **Actor**: Student
- **Preconditions**:
  - Student has opened the project in VS Code (Codespace or local).
- **Main Flow**:
  1. Student opens the file explorer panel in VS Code.
  2. VS Code loads settings from `.vscode/settings.json` and (in Codespaces) from `devcontainer.json` customizations.
  3. The `built/`, `pxt_modules/`, and `.pxt/` directories are excluded from the file tree.
  4. The student sees only source directories (`src/`, `test/`, `scripts/`, `docker/`) and configuration files.
- **Postconditions**:
  - Build artifact directories are hidden in the explorer but still exist on disk.
  - Search excludes also cover these directories (plus `node_modules/`, `yotta_modules/`, `yotta_targets/`).
  - The student is not confused by auto-generated files.
- **Acceptance Criteria**:
  - [ ] `.vscode/settings.json` includes `files.exclude` for `built/`, `pxt_modules/`, `.pxt/`.
  - [ ] `devcontainer.json` customizations include matching `files.exclude` entries.
  - [ ] `search.exclude` covers build artifact directories.
  - [ ] `editor.tabSize` is set to 4.

## SUC-005-04: Docker README explains image purpose generically
Parent: UC-008 (Docker for C++ compilation)

- **Actor**: Student or instructor reading documentation
- **Preconditions**:
  - Reader navigates to `docker/README.md`.
- **Main Flow**:
  1. Reader opens `docker/README.md`.
  2. The README explains that the directory builds a Docker image for ARM cross-compilation of C++ code targeting the BBC micro:bit V2 via CODAL.
  3. The README describes the image contents (gcc-arm-none-eabi, cmake, ninja, python3, srec_cat, yotta).
  4. The README explains how to build the image (`make build`), that `npm run setup` builds it automatically when needed, and that PXT uses the image when C++ files are present.
  5. No references to "LeagueIR", "leaguepulse", or IR-specific functionality appear.
- **Postconditions**:
  - The reader understands the Docker image's purpose and how it integrates with the build pipeline.
- **Acceptance Criteria**:
  - [ ] `docker/README.md` contains no references to "LeagueIR", "leaguepulse", or "IR".
  - [ ] README describes the image as a PXT/CODAL ARM cross-compilation image.
  - [ ] README explains the relationship to `npm run setup` and automatic image building.
  - [ ] README lists the key tools installed in the image.

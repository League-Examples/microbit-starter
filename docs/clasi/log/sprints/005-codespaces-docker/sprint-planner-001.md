---
timestamp: '2026-03-21T18:44:27'
parent: team-lead
child: sprint-planner
scope: docs/clasi/sprints/005-codespaces-docker
sprint: 005-codespaces-docker
template_used: dispatch-template.md.j2
context_documents:
- docs/clasi/sprints/005-codespaces-docker/sprint.md
- docs/clasi/sprints/005-codespaces-docker/architecture-update.md
- docs/clasi/sprints/005-codespaces-docker/usecases.md
---

# Dispatch: team-lead → sprint-planner

# Dispatch: team-lead -> sprint-planner

You are the **sprint-planner**. Your role is to create a complete sprint
plan from the goals and TODO references provided below. You own all
planning decisions: ticket decomposition, scoping, sequencing, and
specification.

## Sprint Context

- **Sprint ID**: 005
- **Sprint directory**: docs/clasi/sprints/005-codespaces-docker
- **TODO IDs to address**:

- **Goals**: Write .devcontainer/devcontainer.json (Node.js 22 base image mcr.microsoft.com/devcontainers/javascript-node:22, Docker-in-Docker feature, postCreateCommand: npm run setup, port 8081 forwarding for bridge with onAutoForward:ignore, VS Code settings to hide built/pxt_modules/.pxt). Write .vscode/settings.json (editor config for PXT projects). Generalize docker/ directory: update docker/README.md to be generic (not IR-specific), verify Dockerfile is already generic. Test that Codespace creation flow works with postCreateCommand. See design doc at docs/inital_planning/MbTemplateDesignV2.md for exact devcontainer.json spec.

## Scope

You write to `docs/clasi/sprints/005-codespaces-docker` only. Produce:
- `sprint.md` with goals, scope, and TODO references
- `usecases.md` with use cases covered by this sprint
- `architecture-update.md` with focused architecture changes
- `tickets/` with numbered ticket files and acceptance criteria

## Context Documents

Read these before planning:
- `docs/clasi/overview.md` -- project overview
- Latest consolidated architecture in `docs/clasi/architecture/`
- TODO files referenced above

## Behavioral Instructions

- Use CLASI MCP tools for all sprint and ticket creation.
- Log every subagent dispatch: call `log_subagent_dispatch` before
  dispatching (architect, architecture-reviewer, technical-lead) and
  `update_dispatch_log` after each returns.
- Do not write code or tests. You produce planning artifacts only.
- Do not skip the architecture review gate.
- Return the completed sprint plan to team-lead when done.

## Context Documents

- `docs/clasi/sprints/005-codespaces-docker/sprint.md`
- `docs/clasi/sprints/005-codespaces-docker/architecture-update.md`
- `docs/clasi/sprints/005-codespaces-docker/usecases.md`

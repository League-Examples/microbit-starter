---
timestamp: '2026-03-21T18:44:17'
parent: team-lead
child: sprint-planner
scope: docs/clasi/sprints/003-npm-scripts-build-pipeline
sprint: 003-npm-scripts-build-pipeline
template_used: dispatch-template.md.j2
context_documents:
- docs/clasi/sprints/003-npm-scripts-build-pipeline/sprint.md
- docs/clasi/sprints/003-npm-scripts-build-pipeline/architecture-update.md
- docs/clasi/sprints/003-npm-scripts-build-pipeline/usecases.md
---

# Dispatch: team-lead → sprint-planner

# Dispatch: team-lead -> sprint-planner

You are the **sprint-planner**. Your role is to create a complete sprint
plan from the goals and TODO references provided below. You own all
planning decisions: ticket decomposition, scoping, sequencing, and
specification.

## Sprint Context

- **Sprint ID**: 003
- **Sprint directory**: docs/clasi/sprints/003-npm-scripts-build-pipeline
- **TODO IDs to address**:

- **Goals**: Implement scripts/setup.js (npm install, pxt target microbit, pxt install, conditional Docker image build if .cpp files present), scripts/build.js (set PXT_FORCE_LOCAL=1 and PXT_COMPILE_SWITCHES=csv---mbcodal, run pxt build, report hex location/size, error if .cpp present but Docker image missing), scripts/deploy.js (build first, read BRIDGE_URL/BRIDGE_KEY from env/.env, POST hex to bridge if both set, else pxt deploy for local USB, print which path used). Each script must have real error handling, precondition checks, and actionable failure messages. See design doc at docs/inital_planning/MbTemplateDesignV2.md for behavioral specs.

## Scope

You write to `docs/clasi/sprints/003-npm-scripts-build-pipeline` only. Produce:
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

- `docs/clasi/sprints/003-npm-scripts-build-pipeline/sprint.md`
- `docs/clasi/sprints/003-npm-scripts-build-pipeline/architecture-update.md`
- `docs/clasi/sprints/003-npm-scripts-build-pipeline/usecases.md`

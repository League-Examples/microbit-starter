---
timestamp: '2026-03-21T18:44:31'
parent: team-lead
child: sprint-planner
scope: docs/clasi/sprints/006-documentation-deploy-template-config
sprint: 006-documentation-deploy-template-config
template_used: dispatch-template.md.j2
context_documents:
- docs/clasi/sprints/006-documentation-deploy-template-config/sprint.md
- docs/clasi/sprints/006-documentation-deploy-template-config/architecture-update.md
- docs/clasi/sprints/006-documentation-deploy-template-config/usecases.md
---

# Dispatch: team-lead → sprint-planner

# Dispatch: team-lead -> sprint-planner

You are the **sprint-planner**. Your role is to create a complete sprint
plan from the goals and TODO references provided below. You own all
planning decisions: ticket decomposition, scoping, sequencing, and
specification.

## Sprint Context

- **Sprint ID**: 006
- **Sprint directory**: docs/clasi/sprints/006-documentation-deploy-template-config
- **TODO IDs to address**:

- **Goals**: Write student-facing README.md (what this is, quick start setup instructions, "ask the AI agent" section, how to add extensions, how to deploy). Finalize deploy script bridge integration (end-to-end test with .env). Enable GitHub template repository setting via repo settings. Run end-to-end test: clone fresh, npm run setup, npm run build, verify .hex output. Final cleanup pass on all files. See design doc at docs/inital_planning/MbTemplateDesignV2.md.

## Scope

You write to `docs/clasi/sprints/006-documentation-deploy-template-config` only. Produce:
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

- `docs/clasi/sprints/006-documentation-deploy-template-config/sprint.md`
- `docs/clasi/sprints/006-documentation-deploy-template-config/architecture-update.md`
- `docs/clasi/sprints/006-documentation-deploy-template-config/usecases.md`

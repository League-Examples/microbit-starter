---
timestamp: '2026-03-21T18:44:12'
parent: team-lead
child: sprint-planner
scope: docs/clasi/sprints/002-template-cleanup-configuration
sprint: 002-template-cleanup-configuration
template_used: dispatch-template.md.j2
context_documents:
- docs/clasi/sprints/002-template-cleanup-configuration/sprint.md
- docs/clasi/sprints/002-template-cleanup-configuration/architecture-update.md
- docs/clasi/sprints/002-template-cleanup-configuration/usecases.md
---

# Dispatch: team-lead → sprint-planner

# Dispatch: team-lead -> sprint-planner

You are the **sprint-planner**. Your role is to create a complete sprint
plan from the goals and TODO references provided below. You own all
planning decisions: ticket decomposition, scoping, sequencing, and
specification.

## Sprint Context

- **Sprint ID**: 002
- **Sprint directory**: docs/clasi/sprints/002-template-cleanup-configuration
- **TODO IDs to address**:

- **Goals**: Delete all LeagueIR-specific files: src/ir.ts, src/ir.cpp, src/irpacket.ts, src/lib.ts, src/shims.ts, shims.d.ts, enums.d.ts, icon.png, test/testNec.ts, test/testIRPacket.ts, test/testPulse.ts, DEVELOPMENT.md, root Makefile. Write new pxt.json (generic "my-robot" config, public:false, files:[src/robot.ts], testFiles:[src/main.ts, test/test.ts]), package.json (npm scripts stubs, pxt-microbit only dep), tsconfig.json, .gitignore (per design doc spec), .env.example (bridge vars commented out). See design doc at docs/inital_planning/MbTemplateDesignV2.md for exact file contents.

## Scope

You write to `docs/clasi/sprints/002-template-cleanup-configuration` only. Produce:
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

- `docs/clasi/sprints/002-template-cleanup-configuration/sprint.md`
- `docs/clasi/sprints/002-template-cleanup-configuration/architecture-update.md`
- `docs/clasi/sprints/002-template-cleanup-configuration/usecases.md`

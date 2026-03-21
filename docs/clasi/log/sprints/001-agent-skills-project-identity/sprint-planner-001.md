---
timestamp: '2026-03-21T18:44:07'
parent: team-lead
child: sprint-planner
scope: docs/clasi/sprints/001-agent-skills-project-identity
sprint: 001-agent-skills-project-identity
template_used: dispatch-template.md.j2
context_documents:
- docs/clasi/sprints/001-agent-skills-project-identity/sprint.md
- docs/clasi/sprints/001-agent-skills-project-identity/architecture-update.md
- docs/clasi/sprints/001-agent-skills-project-identity/usecases.md
---

# Dispatch: team-lead → sprint-planner

# Dispatch: team-lead -> sprint-planner

You are the **sprint-planner**. Your role is to create a complete sprint
plan from the goals and TODO references provided below. You own all
planning decisions: ticket decomposition, scoping, sequencing, and
specification.

## Sprint Context

- **Sprint ID**: 001
- **Sprint directory**: docs/clasi/sprints/001-agent-skills-project-identity
- **TODO IDs to address**:

- **Goals**: Create .claude/skills/static-typescript/SKILL.md (STS language constraints, disallowed features, workarounds, common error mappings), .claude/skills/pxt/SKILL.md (framework patterns, block annotations, C++ shim conventions, files/testFiles split, extension authoring) with references/block-annotations.md, and CLAUDE.md (project identity, build commands, pxt.json rules, deploy behavior, skill pointers, what not to do). The agent becomes useful immediately for all subsequent sprints. See the design doc at docs/inital_planning/MbTemplateDesignV2.md for exact specifications of each file.

## Scope

You write to `docs/clasi/sprints/001-agent-skills-project-identity` only. Produce:
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

- `docs/clasi/sprints/001-agent-skills-project-identity/sprint.md`
- `docs/clasi/sprints/001-agent-skills-project-identity/architecture-update.md`
- `docs/clasi/sprints/001-agent-skills-project-identity/usecases.md`

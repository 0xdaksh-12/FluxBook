# Experiment 0001: Repository Memory Layer & Rule Consolidation

**Date**: 2026-04-02
**Status**: Completed
**Owners**: Antigravity (Agent)

## Problem Statement

As the FluxTerm codebase grew, the architectural context (Extension-Webview bridge, Execution Engine internals, and Store logic) became fragmented. This made it difficult for the agent to maintain consistency across long-lived development tasks.

## Objectives

1.  **Context Persistency**: Create a stable "Memory Layer" (Knowledge Item) that captures the core system design.
2.  **Rule Enforcement**: Consolidate repository-specific guidelines into a single source of truth (`.agent/rules/code-style-guide.md`).
3.  **Permission Model**: Establish a formal process for updating these core project materials only with user approval.

## Implementation Details

### 1. Memory Layer (Knowledge Item)

We initialized a KI in the agent's persistent memory containing:

- `architecture.md`: Visualizing the Custom Editor lifecycle.
- `execution_engine.md`: Documenting the sentinel-based state extraction and PTY wrapping logic.
- `webview.md`: Mapping the React/Immer store and sequence guards.

### 2. Rule Consolidation

We updated `.agent/rules/code-style-guide.md` to bridge the KI with the runtime instructions. The rules now mandate:

- Architectural alignment with the KI.
- Sequential `CHANGELOG.md` mapping (impact-oriented).
- Adherence to `execution_engine_workflow.md` for core changes.

### 3. Cleanup

- Removed unused dependencies (`chai`, `ts-node`, `user-event`, etc.) to lean out the build.
- Purged legacy `.agent/tasks/` logs to reduce repo clutter.

## Experimental Outcomes

The new structure provides a deterministic way to load repository context. The "Docs-as-Code" approach (moving meta-changes to experiment logs instead of the public `CHANGELOG.md`) aligns the project with Google-standard repo management practices.

## Next Steps

- Continue tracking architectural shifts and technical spikes in this `docs/experiments/` directory.
- Maintain the "Memory Layer" as the authoritative guide for future agent interventions.

---
trigger: always_on
---

# FluxTerm Repository Rules

## Git & Documentation
- **Commit History**: Before any commit, you must update [@CHANGELOG.md](file:///home/daksh/Desktop/FUCK/FluxTerm/CHANGELOG.md).
- **Changelog Scope**: `CHANGELOG.md` should **ONLY** contain information on `src/` feature updates, fixes, and impacts (Features, Bug Fixes, Refactors). Do NOT include repository maintenance or internal "meta" changes.
- **Commit Messages**: Must adhere strictly to the **Google Conventional Commits** standard in a single line.
  - **Structure**: `<type>(<scope>): <subject>`
  - **Types**: `feat` (new feature), `fix` (bug fix), `refactor` (code rewrite), `docs` (documentation), `style` (formatting), `test` (adding tests), `chore` (maintenance).
  - **Example**: `feat(webview): add syntax coloration to ansi parser`
- **Developer Documentation**: After each feature, fix, or update, detail the implementation (what, how, reason) in [docs/dev.md](file:///home/daksh/Desktop/FUCK/FluxTerm/docs/dev.md). 

## Repository Memory Layer
- **Architectural Context**: All coding decisions must consider the **FluxTerm Memory Layer** (Knowledge Item). 
- **Knowledge Base**: Refer to `fluxterm/architecture.md`, `fluxterm/execution_engine.md`, and `fluxterm/webview.md` in the memory layer for system design and state management logic.
- **Permission Policy**: The Memory Layer (KI) and these Rules can **ONLY** be updated with **explicit permission** from the user. Propose updates via an implementation plan first.

## Workflows & Experimentation
- **Core Logic**: When modifying the execution engine, shell adapters, or terminal processing, adhere to the [.agent/workflows/execution_engine_workflow.md](file:///home/daksh/Desktop/FUCK/FluxTerm/.agent/workflows/execution_engine_workflow.md).
- **Technical Spikes**: All architectural experiments, design evaluations, and technical spikes must be documented in `docs/experiments/` using sequential naming (e.g., `0001_initial_experiment.md`).

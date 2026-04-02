# Contributing to FluxTerm

Welcome to the FluxTerm project! We follow standard repository management practices to ensure codebase health and architectural consistency.

## Code of Conduct

All contributors are expected to follow our standards of conduct. (See [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md) if it exists).

## Development Workflow

### 1. Development Environment
- Use `pnpm install` for dependencies.
- Run `pnpm dev` (via `npm-run-all`) to start the standard build/watch cycle.
- The webview and extension are bundled via `esbuild.js`.

### 2. Implementation Plans
For complex changes or architectural updates:
- Create an **Implementation Plan** in the agent's brain or `.agent/tasks/` if appropriate.
- For technical spikes or structural evaluations, document the process in `docs/experiments/`.

### 3. Documentation (Docs-as-Code)
- **Always-Current Architecture**: If you change the system design, update `docs/architecture.md`.
- **Developer Guide**: Update `docs/dev.md` with implementation details (what, how, reason) for every non-trivial feature or fix.
- **Rules & Memory Layer**: Refer to `.agent/rules/` for the definitive coding standards and the Repository Memory Layer (Knowledge Items).

## Pull Requests

1. **Self-Review**: Ensure your changes adhere to the rules in `.agent/rules/code-style-guide.md`.
2. **CHANGELOG**: Update `CHANGELOG.md` under the `[Unreleased]` section. **Only include user-facing functional changes in `src/`.** Do not include internal maintenance, documentation tasks, or versioning meta-changes.
3. **Commit Messages**: Must follow the standard **Google Conventional Commits** format.
   - **Format**: `<type>(<scope>): <subject>`
   - **Example**: `feat(engine): integrate native PTY execution pipeline`

## Experimentation and Research

All technical experiments, R&D, and structural renovations are tracked in `docs/experiments/` using sequential naming (e.g., `0001_...`). These records help maintain project context over time.

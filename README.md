# FluxTerm

![FluxTerm Logo](https://raw.githubusercontent.com/0xflame-7/FluxTerm/main/assets/icon.png)

## A modern VS Code extension that reimagines the terminal experience

[Features](#features) • [Installation](#installation) • [How To Use](#how-to-use) • [License](#license)

---

## What is FluxTerm?

**FluxTerm** is a next-generation terminal and execution environment directly integrated into VS Code. Inspired by standalone terminal emulators like Warp and Wave, FluxTerm brings a powerful, intelligent, and seamless terminal workflow right to your editor workspace.

By structuring terminal output as discrete executable blocks rather than an unmanageable continuous stream of text, FluxTerm enables you to isolate, review, and reproduce commands effortlessly.

![FluxTerm Interface](https://via.placeholder.com/800x450.png?text=FluxTerm+Terminal+Preview) <!-- Placeholder for actual screenshot -->

## Features

- **Blazing Fast Native Execution:** Under the hood, FluxTerm uses native PTY layers on Unix environments to ensure standard ANSI coloring and full compatibility with your standard CLI tools.
- **Intelligent Autocomplete:** Accelerate your workflow with smart, context-aware command suggestions.
- **Multi-log Monitoring:** Split views and seamlessly track multiple outputs concurrently with the intuitive drag-and-drop Block UI.
- **Powerful Command Chaining:** Combine sequences of commands directly in the FluxTerm canvas.
- **Rich Output Rendering:** Automatically renders ANSI color sequences perfectly, mapping them to your active VS Code theme for a flawless and beautiful terminal matching your editor.
- **Isolated Blocks:** A notebook-like interface for the CLI. Rerun specific terminal commands, visually segregate stdout and stderr, and track execution time and exit codes individually.

## Installation

FluxTerm is available on the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=0xdaksh-12.fluxterm) (Once Published) or you can install it from source.

### Install from the Marketplace

1. Open **User Settings -> Extensions** in VS Code.
2. Search for `fluxterm`
3. Click Install.

### Install from Source

1. Clone this repository: `git clone https://github.com/0xdaksh-12/FluxTerm.git`
2. Run `pnpm install` in the terminal to install dependencies.
3. Open the repository in VS Code.
4. Press `F5` to open a new VS Code window with the extension loaded in debug mode.

## How To Use

1. **Open an FluxTerm file**: Create a new file with the `.fluxterm` extension or run the command palette (`Ctrl+Shift+P`) and type `FluxTerm: New File`.
2. **Select Shell**: Ensure your desired shell environment (`bash`, `zsh`, `pwsh`, `cmd`) is properly configured and selected from the dropdown in the webview.
3. **Execute Commands**: Type your command in the interactive prompt and press `Enter`. The command output will render instantly as a new enclosed block in the document.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

---

> Crafted by [Daksh](https://github.com/0xdaksh-12)

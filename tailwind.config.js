/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/webview/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--vscode-font-family)", "sans-serif"],
        mono: ["var(--vscode-editor-font-family)", "monospace"],
      },
    },
  },
  plugins: [],
};

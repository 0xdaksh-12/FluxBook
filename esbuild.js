const esbuild = require("esbuild");

const production = process.argv.includes("--production");
const watch = process.argv.includes("--watch");

const esbuildProblemMatcherPlugin = {
  name: "esbuild-problem-matcher",
  setup(build) {
    build.onStart(() => console.log("[watch] build started"));
    build.onEnd((result) => {
      result.errors.forEach(({ text, loc }) => {
        console.error(`✘ [ERROR] ${text}`);
        console.error(`    ${loc.file}:${loc.line}:${loc.column}:`);
      });
      console.log("[watch] build finished");
    });
  },
};

async function main() {
  const commonConfig = {
    bundle: true,
    minify: production,
    sourcemap: !production,
    logLevel: "silent",
    plugins: [esbuildProblemMatcherPlugin],
  };

  // Extension Context
  const ctx = await esbuild.context({
    ...commonConfig,
    entryPoints: ["src/extension.ts"],
    format: "cjs",
    platform: "node",
    outfile: "dist/extension.js",
    external: ["vscode"],
  });

  // Webview Context
  const webviewCtx = await esbuild.context({
    ...commonConfig,
    entryPoints: ["src/webview/index.tsx"],
    format: "iife",
    platform: "browser",
    outfile: "dist/webview.js",
    jsx: "automatic",
    loader: { ".tsx": "tsx", ".ts": "ts" },
  });

  if (watch) {
    await ctx.watch();
    await webviewCtx.watch();
  } else {
    await ctx.rebuild();
    await webviewCtx.rebuild();
    await ctx.dispose();
    await webviewCtx.dispose();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { statSync } from "node:fs";

// Use the installed JS entry directly: this works on Windows without a shell
// shim and keeps the deployment target out of the normal Node/PM2 build.
const root = fileURLToPath(new URL("../", import.meta.url));
const cli = fileURLToPath(new URL("../node_modules/@react-router/dev/bin.js", import.meta.url));
const startedAt = Date.now();
const result = spawnSync(process.execPath, ["--max-old-space-size=1536", cli, "build"], {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env, WEBLAUD_DEPLOY_TARGET: "netlify", RAYON_NUM_THREADS: "1" },
});
if (result.error) console.error(result.error.message);
if (result.status !== 0) process.exit(result.status ?? 1);
// A client-only build can look successful while every SSR route is missing.
// Refuse to deploy absent/stale adapter output.
for (const path of ["../.netlify/v1/functions/react-router-server.mjs", "../build-netlify/server/server.js"]) {
  try {
    if (statSync(new URL(path, import.meta.url)).mtimeMs < startedAt - 2000) throw new Error("stale output");
  } catch {
    console.error(`Netlify SSR output missing or stale: ${path}. Deployment stopped.`);
    process.exit(1);
  }
}

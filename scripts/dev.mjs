/**
 * Stable dev server launcher:
 * - Clears macOS MallocStackLogging (set by Cursor/Xcode terminals)
 * - Uses Webpack instead of Turbopack (fewer child processes, lower RAM)
 * - Caps Node heap to reduce system memory pressure
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const useTurbo = process.argv.includes("--turbo");

const env = { ...process.env };
delete env.MallocStackLogging;
delete env.MallocStackLoggingNoCompact;

const nodeOpts = env.NODE_OPTIONS ?? "";
if (!nodeOpts.includes("max-old-space-size")) {
  env.NODE_OPTIONS = `${nodeOpts} --max-old-space-size=2048`.trim();
}

const nextArgs = ["next", "dev", "--port", "3000"];
if (!useTurbo) {
  nextArgs.push("--webpack");
}

console.log(
  useTurbo
    ? "Starting Next.js (Turbopack) — uses more RAM\n"
    : "Starting Next.js (Webpack) — recommended for lower memory use\n"
);

const child = spawn("npx", nextArgs, {
  cwd: projectRoot,
  env,
  stdio: "inherit",
  shell: false,
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 0);
});

process.on("SIGINT", () => child.kill("SIGINT"));
process.on("SIGTERM", () => child.kill("SIGTERM"));

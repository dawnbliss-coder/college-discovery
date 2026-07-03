import { rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const targets = [".next", "node_modules/.cache"];

for (const dir of targets) {
  const full = path.join(projectRoot, dir);
  try {
    rmSync(full, { recursive: true, force: true });
    console.log(`Removed ${dir}`);
  } catch {
    console.log(`Skipped ${dir} (not found or locked)`);
  }
}

console.log("Clean complete. Run: npm run dev");

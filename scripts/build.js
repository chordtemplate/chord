import { build } from "esbuild";
import { readdirSync, statSync } from "node:fs";
import { rm } from "node:fs/promises";
import { join } from "node:path";

await rm(join(process.cwd(), "dist"), { recursive: true, force: true });

const getAllFiles = (dir) => {
  const files = readdirSync(dir)

  return files.map((file) => {
    if (file.includes("node_modules") || file.includes(".git")) return;

    if (statSync(dir + "/" + file).isDirectory()) { 
      return getAllFiles(dir + "/" + file)
    }

    if (!file.endsWith(".ts")) return;

    return join(dir, file)
  }).filter((file) => Boolean(file)).flat()
}

await build({
  entryPoints: [
    ...getAllFiles(process.cwd())
  ],
  logLevel: "warning",
  outdir: "./dist",
  outbase: ".",
  sourcemap: true,
  target: "node16",
  platform: "node",
  minify: true,
});

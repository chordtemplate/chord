import { build } from "esbuild";
import { readdir, rm } from "node:fs/promises";
import { join } from "node:path";

await rm(join(process.cwd(), "dist"), { recursive: true, force: true });

const files = await readdir(join(process.cwd(), "./events"));

await build({
  entryPoints: [
    ...files.map((file) => join(process.cwd(), "events/", file)),
    join(process.cwd(), "index.ts"),
  ],
  logLevel: "warning",
  outdir: "./dist",
  outbase: ".",
  sourcemap: true,
  target: "node16",
  platform: "node",
  minify: true,
});

import { readdirSync, statSync } from "node:fs";
import { rm } from "node:fs/promises";
import { join } from "node:path";
import { build } from "esbuild";

await rm(join(process.cwd(), "dist"), { recursive: true, force: true });

const isProduction = process.env.NODE_ENV === "production";

const getAllFiles = (dir = process.cwd()) => {
	const files = readdirSync(dir);

	return files
		.map((file) => {
			if (
				file.includes("node_modules") ||
				file.includes(".git") ||
				file.includes("types.ts") ||
				file.includes("dist") ||
				file.includes("scripts")
			)
				return;

			if (statSync(join(dir, file)).isDirectory()) {
				return getAllFiles(join(dir, file));
			}

			if (file.endsWith(".ts") || file.endsWith(".js")) {
				return join(dir, file);
			}
		})
		.filter((file) => Boolean(file))
		.flat();
};

await build({
	entryPoints: getAllFiles(),
	logLevel: "warning",
	outdir: "./dist",
	outbase: ".",
	sourcemap: !isProduction,
	target: "node16",
	platform: "node",
	format: "esm",
	minify: true,
});

console.log(
	`\x1b[32m \x1b[0m Project compiled successfully (source map ${
		isProduction ? "disabled" : "enabled"
	})`,
);

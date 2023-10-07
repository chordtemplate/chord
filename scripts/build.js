import { build } from "esbuild";
import fg from "fast-glob";

const isProduction = process.env.NODE_ENV === "production";

await build({
	entryPoints: await fg(["src/**/*.ts"]),
	logLevel: "warning",
	allowOverwrite: true,
	outdir: "dist",
	outbase: "src",
	sourcemap: !isProduction,
	target: "node20",
	platform: "node",
	format: "esm",
	minify: true,
});

console.log(
	`\x1b[32m \x1b[0m Project compiled successfully (source map ${
		isProduction ? "disabled" : "enabled"
	})`,
);

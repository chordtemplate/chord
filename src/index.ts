import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Client, GatewayIntentBits } from "discord.js";
import fg from "fast-glob";
import {
	type Output,
	enumType,
	object,
	optional,
	parse,
	string,
} from "valibot";
import { setListeners } from "./utils/listeners.js";
import { log } from "./utils/logger.js";

const envVariables = object({
	DISCORD_TOKEN: string(),
	NODE_ENV: optional(enumType(["production", "development"])),
});

try {
	parse(envVariables, process.env);
	log.success(
		`${log.bold("DISCORD_TOKEN")} environment variable is set correctly!`,
	);
} catch {
	log.error(
		`Environment variables aren't set correctly, are you sure you provided the ${log.bold(
			"DISCORD_TOKEN",
		)} and that ${log.bold(
			"NODE_ENV",
		)} is set to either production or development?`,
	);
	process.exit(1);
}

declare global {
	namespace NodeJS {
		// biome-ignore lint/suspicious/noEmptyInterface: Infering from valibot's types.
		interface ProcessEnv extends Output<typeof envVariables> {}
	}
}

const client = new Client<true>({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

fg([join(dirname(fileURLToPath(import.meta.url)), "listeners/**/*.js")])
	.then(async (files) => await setListeners(files, client))
	.then(() => client.login(process.env.DISCORD_TOKEN))
	.catch((err) => {
		log.error("Error loading commands and/or starting client");
		console.error(err);
	});

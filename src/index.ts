import { env } from "node:process";
import { Client, GatewayIntentBits } from "discord.js";
import { envVariables } from "utils/env";
import { setListeners } from "utils/listeners";
import { log } from "utils/logger";

envVariables.parse(env);

log.success(`"DISCORD_TOKEN" environment variable is set correctly!`);

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

try {
	await setListeners(client);
	await client.login(env.DISCORD_TOKEN);
} catch (err) {
	log.error("Error loading commands and/or starting client");
	console.error(err);
}

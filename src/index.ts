import { Client, GatewayIntentBits } from "discord.js";
import { envVariables } from "utils/env";
import { setListeners } from "utils/listeners";
import { log } from "utils/logger";

envVariables.parse(process.env);

log.info(`"DISCORD_TOKEN" environment variable is set correctly!`);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

try {
  await setListeners(client);
  await client.login(process.env.DISCORD_TOKEN);
} catch (err) {
  log.fatal("Error loading commands and/or starting client");
  console.error(err);
}

import { dirname, join } from "node:path";
import { readdir } from "node:fs/promises";
import {
  Client,
  Collection,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
} from "discord.js";
import { z } from "zod";
import { fileURLToPath } from "node:url";

const envVariables = z.object({
  TOKEN: z.string(),
});

envVariables.parse(process.env);

declare global {
  namespace NodeJS {
    // rome-ignore lint/suspicious/noEmptyInterface: Infering from zod's types.
    interface ProcessEnv extends z.infer<typeof envVariables> { }
  }
}

type ClientEvent = (x: unknown) => Promise<void>  

type FullClientEvent = {
  data: SlashCommandBuilder | string;
  event: ClientEvent;
};

const TOKEN = process.env.TOKEN;
const rest = new REST().setToken(TOKEN);

const dir = dirname(fileURLToPath(import.meta.url));
const commands = new Collection<string, [SlashCommandBuilder, ClientEvent]>();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = commands.get(interaction.commandName);
  await command?.[1](interaction);
});

client.once("ready", async () => {
  await rest.put(Routes.applicationCommands(client.user?.id ?? ""), {
    body: commands.map(([data]) => data.toJSON()),
  });

  console.log(`ready on ${client.user?.tag}`);
  console.log(`info: in ${client.guilds.cache.size} servers`);
});

const loadCommands = async () => {
  const files = await readdir(join(dir, "./events"));
  files
    .filter((file) => file.endsWith(".js"))
    .forEach(async (file) => {
	const { data, event }: FullClientEvent = await import(
	    join(dir, `./events/${file}`)
	);

    if (data instanceof SlashCommandBuilder) {
      commands.set(data.name, [data, event]);
    } else {
      client.on(data, event);
    }
  });
};

try {
  await Promise.all([
    loadCommands(),
    client.login(TOKEN),
  ]) 
} catch (err) {
  console.error(err);
}

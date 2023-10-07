import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
	Client,
	Collection,
	Colors,
	EmbedBuilder,
	Events,
	GatewayIntentBits,
	REST,
	Routes,
	SlashCommandBuilder,
} from "discord.js";
import {
	type Output,
	enumType,
	object,
	optional,
	parse,
	string,
} from "valibot";
import { log } from "./utils/logger.js";
import type { ClientAction, ClientEvent } from "typings";
import fg from "fast-glob";

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

const TOKEN = process.env.DISCORD_TOKEN;

const rest = new REST().setToken(TOKEN);
const dir = dirname(fileURLToPath(import.meta.url));
const commands = new Collection<string, [SlashCommandBuilder, ClientAction]>();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

client.once(Events.ClientReady, () => {
	rest
		.put(Routes.applicationCommands(client.user?.id ?? ""), {
			body: commands.map(([data]) => data.toJSON()),
		})
		.then(() => {
			log.success(`Logged in as ${log.bold(client.user?.tag)}`);
		})
		.catch((err) => {
			log.error("There was an error uploading commands to Discord API");
			console.error(err);
		});
});

client.on(Events.InteractionCreate, (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = commands.get(interaction.commandName);
	if (!command?.length) {
		log.error(`Command with name "${interaction.commandName}" was not found!`);
		return;
	}

	const [data, action] = command;

	action(interaction).catch((err) => {
		log.error(`Uncaught error at command "${data.name}"`);
		console.error(err);
		interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setTitle("There was an error with this command")
					.setDescription(
						`The command ${data.name} failed by unknown reasons, try again later, or report this bug.`,
					)
					.setColor(Colors.Red)
					.setTimestamp(new Date()),
			],
		});
	});
});

fg([join(dir, "listeners/**/*.js")])
	.then(async (files) => {
		for (const file of files) {
			const { on, action }: ClientEvent = await import(file);

			log.info(`Loaded ${file}`);

			if (on instanceof SlashCommandBuilder) {
				commands.set(on.name, [on, action]);
				continue;
			}

			client.on(on, (x) => {
				action(x).catch((err) => {
					log.error(
						`Uncaught error at event on file "${file.slice(0, -3)}.ts"`,
					);
					console.error(err);
				});
			});
		}
	})
	.then(() => client.login(TOKEN))
	.catch((err) => {
		log.error("Error loading commands and/or starting client");
		console.error(err);
	});

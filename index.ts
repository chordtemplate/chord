import { readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
	Client,
	Collection,
	GatewayIntentBits,
	REST,
	Routes,
	SlashCommandBuilder,
} from "discord.js";
import {
	object,
	string,
	enumType,
	parse,
	optional,
	type Output,
} from "valibot";

const envVariables = object({
	DISCORD_TOKEN: string(),
	NODE_ENV: optional(enumType(["production", "development"])),
});

try {
	parse(envVariables, process.env);
} catch {
	console.error(
		"\x1b[31m \x1b[0m Environment variables aren't set correctly, are you sure you provided the \x1b[1mDISCORD_TOKEN\x1b[0m and that \x1b[1mNODE_ENV\x1b[0m is set to either production or development?",
	);
	process.exit(1);
}

console.log(
	"\x1b[32m \x1b[0m \x1b[1mDISCORD_TOKEN\x1b[0m environment variable is set correctly!",
);

declare global {
	namespace NodeJS {
		// biome-ignore lint/suspicious/noEmptyInterface: Infering from zod's types.
		interface ProcessEnv extends Output<typeof envVariables> {}
	}
}

type ClientAction = (x: unknown) => Promise<void>;

type ClientEvent = {
	data: SlashCommandBuilder | string;
	action: ClientAction;
};

const TOKEN = process.env.DISCORD_TOKEN;

const rest = new REST().setToken(TOKEN);

const dir = dirname(fileURLToPath(import.meta.url));

const commands = new Collection<string, [SlashCommandBuilder, ClientAction]>();

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
	command?.[1](interaction).catch((err) => {
		console.error(
			`\x1b[31m \x1b[0m Uncaught error at command "${command?.[0].name}"`,
		);
		console.error(err);
	});
});

client.once("ready", () => {
	rest
		.put(Routes.applicationCommands(client.user?.id ?? ""), {
			body: commands.map(([data]) => data.toJSON()),
		})
		.then(() => {
			console.log(
				`\x1b[32m \x1b[0m Logged in as \x1b[1m${client.user?.tag}\x1b[0m`,
			);
			console.log(
				`\x1b[32m \x1b[0m Bot in ${client.guilds.cache.size} servers`,
			);
		})
		.catch((err) => {
			console.error(
				"\x1b[31m \x1b[0m There was an error uploading commands to Discord API",
			);
			console.error(err);
		});
});

const loadCommands = async (): Promise<void> => {
	try {
		(await readdir(join(dir, "./events")))
			.filter((file) => file.endsWith(".js"))
			.forEach(async (file) => {
				const { data, action }: ClientEvent = await import(
					join(dir, `./events/${file}`)
				);

				if (data instanceof SlashCommandBuilder) {
					commands.set(data.name, [data, action]);
				} else {
					client.on(data, async (x) => {
						try {
							await action(x);
						} catch (err) {
							console.error(
								`\x1b[31m \x1b[0m Uncaught error at event on file "${file.slice(
									0,
									-3,
								)}.ts"`,
							);
							console.error(err);
						}
					});
				}
			});
	} catch (err) {
		console.error("\x1b[31m \x1b[0m Error loading commands");
		console.error(err);
	}
};

loadCommands()
	.then(() => client.login(TOKEN))
	.catch((e) => console.error(e));

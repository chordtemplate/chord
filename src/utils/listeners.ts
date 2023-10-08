import { join } from "node:path";
import {
	type Client,
	Collection,
	ContextMenuCommandBuilder,
	SlashCommandBuilder,
} from "discord.js";
import fg from "fast-glob";
import { log } from "./logger";

export const commands = new Collection<
	string,
	[SlashCommandBuilder | ContextMenuCommandBuilder, ClientAction]
>();

export async function setListeners(client: Client) {
	const files = await fg([join(process.cwd(), "src/listeners/**/*.ts")]);

	for (const file of files) {
		const { on, action }: ClientEvent = await import(file);

		log.info(`Loaded ${file}`);

		if (
			on instanceof SlashCommandBuilder ||
			on instanceof ContextMenuCommandBuilder
		) {
			commands.set(on.name, [on, action]);
			continue;
		}

		client.on(on, (x) => {
			action(x).catch((err) => {
				log.error(`Uncaught error at event on file "${file.slice(0, -3)}.ts"`);
				console.error(err);
			});
		});
	}
}

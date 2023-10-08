import { join } from "node:path";
import {
	type Client,
	Collection,
	ContextMenuCommandBuilder,
	SlashCommandBuilder,
} from "discord.js";
import fg from "fast-glob";
import { log } from "utils/logger";

export const commands = new Collection<
	string,
	[SlashCommandBuilder | ContextMenuCommandBuilder, ClientAction]
>();

export async function setListeners(client: Client) {
	const files = await fg([join(process.cwd(), "src/listeners/**/*.ts")]);

	for (const file of files) {
		const { on, action }: ClientEvent = await import(file);

		const isSlashCommand = on instanceof SlashCommandBuilder;
		const isContextCommand = on instanceof ContextMenuCommandBuilder;

		if (typeof on !== "string" && !isSlashCommand && !isContextCommand) {
			throw new TypeError(
				`Command at "${file}" is missing or is not exporting the "on" listener data`,
			);
		}

		if (typeof action !== "function") {
			throw new TypeError(
				`Command at "${file}" is missing or is not exporting the "action" function`,
			);
		}

		log.info(`Loaded ${file}`);

		if (isSlashCommand || isContextCommand) {
			commands.set(on.name, [on, action]);
			continue;
		}

		client.on(on, (x) => {
			action(x).catch((err) => {
				log.error(`Uncaught error at event on file "${file}"`);
				console.error(err);
			});
		});
	}
}

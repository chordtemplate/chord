import { type Client, Collection, SlashCommandBuilder } from "discord.js";
import type { ClientAction, ClientEvent } from "typings";
import { log } from "./logger.js";

export const commands = new Collection<
	string,
	[SlashCommandBuilder, ClientAction]
>();

export async function setListeners(files: string[], client: Client) {
	for (const file of files) {
		const { on, action }: ClientEvent = await import(file);

		log.info(`Loaded ${file}`);

		if (on instanceof SlashCommandBuilder) {
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

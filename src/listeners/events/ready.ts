import { type Client, Events, Routes } from "discord.js";
import type { EventAction } from "typings";
import { commands } from "../../utils/listeners.js";
import { log } from "../../utils/logger.js";

export const on = Events.ClientReady;

export const action: EventAction<Client<true>> = async (client) => {
	client.rest
		.put(Routes.applicationCommands(client.user.id), {
			body: commands.map(([data]) => data.toJSON()),
		})
		.then(() => {
			log.success(`Logged in as ${log.bold(client.user.tag)}`);
		})
		.catch((err) => {
			log.error("There was an error uploading commands to Discord API");
			console.error(err);
		});
};

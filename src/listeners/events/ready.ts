import { type Client, Events, Routes } from "discord.js";
import { commands } from "utils/listeners";
import { log } from "utils/logger";

export const on = Events.ClientReady;

export const action: Action<Client<true>> = async (client) => {
	client.rest
		.put(Routes.applicationCommands(client.user.id), {
			body: commands.map(([data]) => data.toJSON()),
		})
		.then(() => {
			log.success(`Logged in as "${client.user.tag}"`);
		})
		.catch((err) => {
			log.error("There was an error uploading commands to Discord API");
			console.error(err);
		});
};

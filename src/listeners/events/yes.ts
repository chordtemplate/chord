import type { Message } from "discord.js";
import { Events } from "discord.js";

export const on = Events.MessageCreate;

export const action: Action<Message> = async (message) => {
	if (message.content === "yes") {
		await message.channel.send("no");
	}
};

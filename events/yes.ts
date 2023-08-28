import type { Message } from "discord.js";
import { Events } from "discord.js";

export const data = Events.MessageCreate;

export const event = async (message: Message) => {
	if (message.content === "yes") {
		await message.channel.send("no");
	}
};

import type { ClientEvent } from "../typings";
import { Events, Message } from "discord.js";

export const data = Events.MessageCreate;

export const event: ClientEvent = async (message: Message) => {
	if (message.content === "yes") {
		await message.channel.send("no");
	}
};

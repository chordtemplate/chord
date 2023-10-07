import { type Message } from "discord.js";
import { Events } from "discord.js";
import { type EventAction } from "../types";

export const data = Events.MessageCreate;

export const action: EventAction<Message> = async (message) => {
	if (message.content === "yes") {
		await message.channel.send("no");
	}
};

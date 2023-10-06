import { type ChatInputCommandInteraction } from "discord.js";

export type CommandAction = (
	interaction: ChatInputCommandInteraction,
) => Promise<void>;

export type EventAction<T> = (x: T) => Promise<void>;

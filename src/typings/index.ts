import {
	type ChatInputCommandInteraction,
	type SlashCommandBuilder,
} from "discord.js";

export type CommandAction = (
	interaction: ChatInputCommandInteraction,
) => Promise<void>;

export type EventAction<T> = (x: T) => Promise<void>;

export type ClientAction = (x: unknown) => Promise<void>;
export type ClientEvent = {
	data: SlashCommandBuilder | string;
	action: ClientAction;
};

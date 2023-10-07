import type {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
} from "discord.js";

export type CommandAction = (
	interaction: ChatInputCommandInteraction,
) => Promise<void>;

export type EventAction<T> = (x: T) => Promise<void>;

export type ClientAction = (x: unknown) => Promise<void>;
export type ClientEvent = {
	on: SlashCommandBuilder | string;
	action: ClientAction;
};

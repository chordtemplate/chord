import type {
	ChatInputCommandInteraction,
	CommandInteraction,
	ContextMenuCommandBuilder,
	MessageContextMenuCommandInteraction,
	SlashCommandBuilder,
	UserContextMenuCommandInteraction,
} from "discord.js";

export type CommandAction<T extends CommandInteraction> = (
	interaction: T,
) => Promise<void>;

export type EventAction<T> = (x: T) => Promise<void>;

export type ClientAction = (x: unknown) => Promise<void>;
export type ClientEvent = {
	on: SlashCommandBuilder | ContextMenuCommandBuilder | string;
	action: ClientAction;
};

export type Slash = ChatInputCommandInteraction;
export type UserCtx = UserContextMenuCommandInteraction;
export type MsgCtx = MessageContextMenuCommandInteraction;

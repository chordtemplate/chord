import type {
	ChatInputCommandInteraction,
	ContextMenuCommandBuilder,
	MessageContextMenuCommandInteraction,
	SlashCommandBuilder,
	UserContextMenuCommandInteraction,
} from "discord.js";
import { envVariables } from "utils/env";
import { type Output } from "valibot";
import { z } from "zod";

declare global {
	namespace NodeJS {
		// biome-ignore lint/suspicious/noEmptyInterface: Infering from zod's types.
		interface ProcessEnv extends z.infer<typeof envVariables> {}
	}

	interface Response {
		json<T>(): Promise<T>;
	}

	type ClientAction = (x: unknown) => Promise<void>;

	interface ClientEvent {
		on: SlashCommandBuilder | ContextMenuCommandBuilder | string;
		action: ClientAction;
	}

	type Action<T> = (x: T) => Promise<void>;

	type SlashCommand = ChatInputCommandInteraction;
	type UserCommand = UserContextMenuCommandInteraction;
	type MessageCommand = MessageContextMenuCommandInteraction;
}

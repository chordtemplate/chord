import type { ChatInputCommandInteraction } from "discord.js";

export type CI = ChatInputCommandInteraction;
// rome-ignore lint/suspicious/noExplicitAny: It can truly be any type
export type ClientEvent = (x: any) => Promise<void>;

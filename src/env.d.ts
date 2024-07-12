import type {
  ChatInputCommandInteraction,
  ContextMenuCommandBuilder,
  InteractionResponse,
  Message,
  MessageContextMenuCommandInteraction,
  SlashCommandBuilder,
  UserContextMenuCommandInteraction,
} from "discord.js";
import { envVariables } from "utils/env";
import { z } from "zod";

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> { }
  }

  interface ClientEvent {
    data: SlashCommandBuilder | ContextMenuCommandBuilder | string;
    action: Action<unknown>;
  }

  type Action<T> = (x: T) => Promise<boolean | undefined>;

  type SlashCommand = ChatInputCommandInteraction;
  type UserCommand = UserContextMenuCommandInteraction;
  type MessageCommand = MessageContextMenuCommandInteraction;
}

import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import type { CommandAction, MsgCtx } from "typings";

export const on = new ContextMenuCommandBuilder()
	.setName("Echo Message!")
	.setType(ApplicationCommandType.Message);

export const action: CommandAction<MsgCtx> = async (interaction) => {
	await interaction.reply(`echo: "${interaction.targetMessage.content}"`);
};

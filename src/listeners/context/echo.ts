import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";

export const on = new ContextMenuCommandBuilder()
	.setName("Echo Message!")
	.setType(ApplicationCommandType.Message);

export const action: Action<MessageCommand> = async (interaction) => {
	await interaction.reply(`echo: "${interaction.targetMessage.content}"`);
};

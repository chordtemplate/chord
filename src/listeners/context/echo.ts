import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";

export const data = new ContextMenuCommandBuilder()
	.setName("Echo Message!")
	.setType(ApplicationCommandType.Message);

export const action: Action<MessageCommand> = async (interaction) => {
	await interaction.reply({
		content: `message "${interaction.targetMessage.content}" by ${interaction.targetMessage.author}`,
		embeds: interaction.targetMessage.embeds,
		components: interaction.targetMessage.components,
		files: [...interaction.targetMessage.attachments.values()],
	});

	return true;
};

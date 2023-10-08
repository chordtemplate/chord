import { SlashCommandBuilder } from "discord.js";

export const on = new SlashCommandBuilder()
	.setName("clean")
	.setDescription("Clean messages in a channel!")
	.addIntegerOption((option) =>
		option
			.setName("amount")
			.setDescription("Amount of messages to be deleted")
			.setRequired(true),
	);

export const action: Action<SlashCommand> = async (interaction) => {
	const amount = interaction.options.getInteger("amount", true);

	if (!interaction.inGuild()) {
		await interaction.reply(":x: This command can only be run in a server!");
		return;
	}

	if (!interaction.channel) {
		await interaction.reply(
			":x: This command can only be run in a text channel!",
		);
		return;
	}

	if (amount > 100) {
		await interaction.editReply(
			":x: You can't delete more than 100 messages at a time!",
		);
		return;
	}

	console.log(amount);

	const { size } = await interaction.channel.bulkDelete(amount, true);

	await interaction.reply(`Successfully deleted **${size}** messages`);
};

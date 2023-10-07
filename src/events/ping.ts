import { SlashCommandBuilder } from "discord.js";
import { type CommandAction } from "../typings";

export const data = new SlashCommandBuilder()
	.setName("ping")
	.setDescription(
		"Measures the latency between the moment this command gets executed and when it answers.",
	);

export const action: CommandAction = async (interaction) => {
	await interaction.deferReply();

	const reply = await interaction.fetchReply();

	const ping = reply.createdTimestamp - interaction.createdTimestamp;

	await interaction.editReply(
		`🏓 Latency is ${ping}ms. API Latency is ${interaction.client.ws.ping}ms`,
	);
};

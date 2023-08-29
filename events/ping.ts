import type { CI } from "../typings";
import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("ping")
	.setDescription(
		"Measures the latency between the moment this command gets executed and when it answers.",
	);

export const event = async (interaction: CI) => {
	await interaction.deferReply();

	const reply = await interaction.fetchReply();

	const ping = reply.createdTimestamp - interaction.createdTimestamp;

	await interaction.editReply(
		`🏓Latency is ${ping}ms. API Latency is ${interaction.client.ws.ping}ms`,
	);
};

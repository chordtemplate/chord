import type { CI } from "../typings";
import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("ping")
	.setDescription(
		"Measures the latency between the moment this command gets executed and when it answers.",
	);

export const event = async (interaction: CI) => {
	await interaction.reply(
		`🏓Latency is ${Date.now() - interaction.createdTimestamp
		}ms. API Latency is ${Math.round(interaction.client.ws.ping)}ms`,
	);
};

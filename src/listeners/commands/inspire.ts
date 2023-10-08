import { SlashCommandBuilder } from "discord.js";

interface Quote {
	content: string;
	author: string;
}

export const on = new SlashCommandBuilder()
	.setName("inspire")
	.setDescription("Returns a random inspirational quote");

export const action: Action<SlashCommand> = async (interaction) => {
	try {
		const res = await fetch("https://api.quotable.io/random");
		const { content, author } = await res.json<Quote>();
		await interaction.reply(`"${content}"  - ${author}`);
	} catch {
		await interaction.reply(":x: There was an error fetching quote");
	}
};

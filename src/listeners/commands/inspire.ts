import { SlashCommandBuilder } from "discord.js";
import { embeds } from "utils/embeds";

interface Quote {
  content: string;
  author: string;
}

export const data = new SlashCommandBuilder()
  .setName("inspire")
  .setDescription("Returns a random inspirational quote");

export const action: Action<SlashCommand> = async (interaction) => {
  try {
    const res = await fetch("https://api.quotable.io/random");
    const { content, author } = (await res.json()) as Quote;
    await interaction.reply({ content: `"${content}"  - ${author}` });
  } catch {
    await interaction.reply({
      embeds: [embeds.error("There was an error fetching quote")],
    });
  }

  return true;
};

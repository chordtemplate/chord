import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription(
    "Measures the latency between the moment this command gets executed and when it answers.",
  );

export const action: Action<SlashCommand> = async (interaction) => {
  const reply = await interaction.deferReply({ fetchReply: true });
  const ping = reply.createdTimestamp - interaction.createdTimestamp;

  await interaction.editReply({
    content: `🏓 Latency is ${ping}ms. API Latency is ${interaction.client.ws.ping}ms`,
  });

  return true;
};

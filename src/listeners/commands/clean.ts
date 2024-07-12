import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { embeds } from "utils/embeds";

export const data = new SlashCommandBuilder()
  .setName("clean")
  .setDescription("Clean messages in a channel!")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
  .addIntegerOption((option) =>
    option
      .setName("amount")
      .setDescription("Amount of messages to be deleted")
      .setRequired(true),
  );

export const action: Action<SlashCommand> = async (interaction) => {
  const amount = interaction.options.getInteger("amount", true);

  if (!interaction.inGuild()) {
    await interaction.reply({
      embeds: [embeds.error("This command can only be run in a server!")],
    });
    return false;
  }

  if (!interaction.channel) {
    await interaction.reply({
      embeds: [embeds.error("This command can only be run in a text channel!")],
    });
    return false;
  }

  if (amount > 100) {
    await interaction.reply({
      embeds: [
        embeds.error("You can't delete more than 100 messages at a time!"),
      ],
    });
    return false;
  }

  const { size } = await interaction.channel.bulkDelete(amount, true);

  await interaction.reply({
    embeds: [embeds.success(`Successfully cleaned **${size}** messages`)],
  });

  return true;
};

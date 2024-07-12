import { Colors, EmbedBuilder } from "discord.js";

export const embeds = {
  success: (message: string) =>
    new EmbedBuilder()
      .setDescription(`:white_check_mark: ${message}`)
      .setColor(Colors.Green),
  error: (message: string) =>
    new EmbedBuilder()
      .setDescription(`:x: ${message}`)
      .setColor(Colors.Red)
      .setTimestamp(new Date()),
};

import { Colors, EmbedBuilder, Events, type Interaction } from "discord.js";
import { commands } from "utils/listeners";
import { log } from "utils/logger";

export const data = Events.InteractionCreate;

export const action: Action<Interaction> = async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = commands.get(interaction.commandName);
  if (!command?.length) {
    log.error(`Command with name "${interaction.commandName}" was not found!`);
    return false;
  }

  const [_, action] = command;

  try {
    const success = await action(interaction);

    if (success === false) {
      log.warn(
        `Error was caught at command "${interaction.commandName
        }", this is normal behaviour most of the time, but worth checking, command was executed with the following options: "${interaction.toString()}"`,
      );
    } else if (success === true) {
      log.success(
        `Command "${interaction.commandName}" executed successfully!`,
      );
    }
  } catch (err) {
    log.fatal(`Uncaught error at command "${interaction.commandName}"`);
    console.error(err);

    const embed = new EmbedBuilder()
      .setTitle("There was an error with this command")
      .setDescription(
        `The command ${interaction.commandName} failed by unknown reasons, try again later, or report this bug.`,
      )
      .setColor(Colors.Red)
      .setTimestamp(new Date());

    if (interaction.replied || interaction.deferred) {
      await interaction.editReply({ embeds: [embed] });
      return false;
    }

    await interaction.reply({ embeds: [embed] });
    return false;
  }

  return true;
};

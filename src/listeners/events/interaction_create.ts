import { Colors, EmbedBuilder, Events, type Interaction } from "discord.js";
import type { EventAction } from "typings";
import { commands } from "../../utils/listeners.js";
import { log } from "../../utils/logger.js";

export const on = Events.InteractionCreate;

export const action: EventAction<Interaction> = async (interaction) => {
	if (!interaction.isCommand()) return;

	const command = commands.get(interaction.commandName);
	if (!command?.length) {
		log.error(`Command with name "${interaction.commandName}" was not found!`);
		return;
	}

	const [data, action] = command;

	action(interaction).catch((err) => {
		log.error(`Uncaught error at command "${data.name}"`);
		console.error(err);
		interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setTitle("There was an error with this command")
					.setDescription(
						`The command ${data.name} failed by unknown reasons, try again later, or report this bug.`,
					)
					.setColor(Colors.Red)
					.setTimestamp(new Date()),
			],
		});
	});
};

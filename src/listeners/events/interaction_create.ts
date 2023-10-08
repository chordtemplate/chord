import { Colors, EmbedBuilder, Events, type Interaction } from "discord.js";
import { commands } from "utils/listeners";
import { log } from "utils/logger";

export const on = Events.InteractionCreate;

export const action: Action<Interaction> = async (interaction) => {
	if (!interaction.isCommand()) return;

	const command = commands.get(interaction.commandName);
	if (!command?.length) {
		log.error(`Command with name "${interaction.commandName}" was not found!`);
		return;
	}

	const [data, action] = command;

	await action(interaction).catch((err) => {
		log.error(`Uncaught error at command "${data.name}"`);
		console.error(err);

		const embed = new EmbedBuilder()
			.setTitle("There was an error with this command")
			.setDescription(
				`The command ${data.name} failed by unknown reasons, try again later, or report this bug.`,
			)
			.setColor(Colors.Red)
			.setTimestamp(new Date());

		interaction
			.reply({
				embeds: [embed],
			})
			.catch(() => {
				interaction.editReply({ embeds: [embed] }).catch(() => {});
			});
	});
};

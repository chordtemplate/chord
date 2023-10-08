import {
	ActionRowBuilder,
	ApplicationCommandType,
	ButtonBuilder,
	ButtonStyle,
	ContextMenuCommandBuilder,
	EmbedBuilder,
	GuildMember,
	PermissionFlagsBits,
} from "discord.js";

export const on = new ContextMenuCommandBuilder()
	.setName("User Info")
	.setType(ApplicationCommandType.User);

export const action: Action<UserCommand> = async (interaction) => {
	const member = interaction.targetMember as GuildMember | null;
	const user = interaction.targetUser;

	const embed = new EmbedBuilder()
		.setTitle(`Who is ${user.username}?`)
		.setThumbnail(user.displayAvatarURL())
		.setFields(
			{
				name: "__Name__",
				value: `[**\`${user.id}\`**]`,
			},
			{
				name: "__Account Creation__",
				value: `<t:${Math.floor(user.createdTimestamp / 1000) + 3600}:R>`,
			},
			{
				name: "__Joined Server__",
				value: member?.joinedTimestamp
					? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`
					: "(No information available)",
			},
			{
				name: "__Permissions__",
				value: `${
					(
						Object.keys(PermissionFlagsBits) as Array<
							keyof typeof PermissionFlagsBits
						>
					).reduce(
						(acc, p) => (member?.permissions.has(p) ? `${acc}\`${p}\`, ` : ""),
						"",
					) || "(No Permissions)"
				}`,
			},
			{
				name: "__Bot__",
				value: `${user.bot}`,
			},
			{
				name: "__Roles__",
				value: `${[...(member?.roles.cache || [])].join(", ") || "(No Roles)"}`,
			},
		)
		.setFooter({
			text: `${user.tag} • ${user.id}`,
			iconURL: user.displayAvatarURL(),
		})
		.setTimestamp(new Date())
		.setColor(0x2b2d31);

	await interaction.reply({
		embeds: [embed],
		components: [
			new ActionRowBuilder<ButtonBuilder>().addComponents(
				new ButtonBuilder()
					.setLabel("Avatar")
					.setURL(user.displayAvatarURL())
					.setStyle(ButtonStyle.Link),
			),
		],
	});
};

const { SlashCommandBuilder } = require('discord.js');
const { AudioPlayerStatus } = require('@discordjs/voice');
const { getVoiceConnection } = require('@discordjs/voice');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stop all of LCARS\' playback.'),
	async execute(interaction) {
		await interaction.deferReply({ephemeral: true})
		const connection = getVoiceConnection(interaction.guildId);
		connection.destroy();
		await interaction.deleteReply()
	},
};
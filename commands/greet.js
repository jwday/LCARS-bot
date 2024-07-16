const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, StreamType } = require('@discordjs/voice');
const fs = require('fs');
const { playSound } = require('../utils/say.js')

module.exports = {
	data: {
		name: 'greet',
		type: 1,
		description: 'Make LCARS say hello.',
		options: [
			{
				name: 'volume',
				type: 10,
				description: 'Volume (0-10)',
				required: false,
				min_value: 1,
				max_value: 10,
			},
			{
				name: 'voice',
				type: 3,
				description: 'Which voice to use',
				options: [
					{
						name: 'default',
						type: 1,
						description: 'The default voice',
						required: false,
						value: 'default',
					},
					{
						name: 'random',
						type: 1,
						description: 'Choose a random voice',
						required: false,
						value: 'random',
					},
				]
			}
		]
		// syntax: '!greet [-v XX | -vol XX] [-r | -rand] [-c | -chat]',
		// arguments: {'-v': 'Volume (0-10)', '-r': 'Randomize voice', '-c': 'Display in chat'},
		// cooldown: 5,
		// voiceReq: true,
	},
	async execute(interaction) {
		// Acknowledge the interaction without sending an immediate response
		await interaction.deferReply({ ephemeral: true });

		// Check if the user is in a voice channel
		const voiceChannel  = interaction.member.voice.channel;
		if (!voiceChannel) {
            return interaction.reply({ content: 'You need to be in a voice channel to use this command!', ephemeral: true });
		}

        // Get the options (with default values if not provided)
        const volume = interaction.options.getNumber('volume') ?? 5;
        const voice = interaction.options.getString('voice') ?? 'default';
		
        // Join the voice channel
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
            selfDeaf: false, // Bot joins deafened
            selfMute: false  // Bot joins muted
        });
		
		// Choose a sound to play
		const soundsDir = `join_voice/`;
        if (voice === 'random') {
			const soundFiles = fs.readdirSync(soundsDir);
            const randomFile = soundFiles[Math.floor(Math.random() * soundFiles.length)];
			var snd = randomFile;
        } else {
			var snd = 'gbl.hi_bot.wav';
        }

		// Play the sound
		playSound(connection, soundsDir+snd, volume)

		// Kill the interaction
		await interaction.deleteReply()
	},
};
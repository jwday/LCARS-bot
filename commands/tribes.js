const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { PassThrough, Writable } = require('node:stream');
const youtubedl = require('youtube-dl-exec')
const fs = require('fs');
 
module.exports = {
	data: new SlashCommandBuilder()
		.setName('tribes')
		.setDescription('DL tribes'),

	async execute(interaction) {
		await interaction.deferReply()

		// Handle arguments
		const vol = interaction.options.getString('volume') ?? 5;

        // Fetch metadata
        let meta;
        try {
            meta = await youtubedl('https://www.youtube.com/watch?v=L-uHSx-YrSA', {
                dumpSingleJson: true,
                noWarnings: true,
                noCheckCertificates: true,
                preferFreeFormats: true,
                youtubeSkipDashManifest: true
            });
        } catch (error) {
            message.reply('Failed to fetch video metadata.');
            console.error(error);
            return;
        }

		// Set up embed object
		const colors = ['#ec0000', '#FFC300', '#008bec']
		const randColor = colors[Math.floor(Math.random() * colors.length)];
		const newEmbed = new EmbedBuilder()
			.setColor(randColor)
			.setAuthor({ name: meta.uploader, url: meta.webpage_url })
			.setTitle(meta.title)
			// .setURL(song.url)
			// .setDescription()
			.setThumbnail(meta.thumbnail)
			.addFields(
				// { 
					// 	name: song.author,
					// 	value: `[Watch on YouTube](${song.url})`
					// 	// value: song.author 
					// },
					{
						name: 'Requester',
						value: interaction.member.displayName,
						inline: true
					},
					{ 
						name: 'Volume', 
						value: `${vol}/10`,
						inline: true 
					},
					{ 
						name: 'Duration', 
						value: meta.duration_string,
						inline: true 
					},
				)
			// .addField('This was a risky play!', `${message.member.displayName} may have played something unexpected.`, false);
			// .setImage('https://i.imgur.com/wSTFkRM.png')
			// .setTimestamp()
			// .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

		// Check if the user is in a voice channel
		const  voiceChannel  = interaction.member.voice.channel;
		if (!voiceChannel) {
            return interaction.reply({ content: 'You need to be in a voice channel to use this command!', ephemeral: true });
		}

		// Join the voice channel
		const connection = joinVoiceChannel({
			channelId: voiceChannel.id,
			guildId: interaction.guild.id,
			adapterCreator: interaction.guild.voiceAdapterCreator,
			selfDeaf: false, // Bot joins deafened
			selfMute: false  // Bot joins muted
		});

		// Grab audio
		stream = youtubedl.exec(meta.webpage_url, {
			output: '-',
			extractAudio: true
		}, { stdio: ['ignore', 'pipe', 'ignore'] })

		// Create WriteableStream
		const passThroughStream = new PassThrough();
        stream.stdout.pipe(passThroughStream);

		// Create an audio resource
		const resource = createAudioResource(passThroughStream, {
			inlineVolume: true
		});
		resource.volume.setVolume(vol / 10);
		
		// Create an audio player
		const player = createAudioPlayer();

		// Play the audio resource
		player.play(resource);
		connection.subscribe(player);

		player.on(AudioPlayerStatus.Playing, async () => {
			console.log('The audio is now playing!');
			await interaction.editReply({ 
				embeds: [newEmbed], 
			});
		});
	},
};
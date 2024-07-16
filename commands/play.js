const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { PassThrough } = require('node:stream');
const googleIt = require('google-it');
const youtubedl = require('youtube-dl-exec')
const { botSay } = require('../utils/say.js');
// const { LCARSEMbedCreator } = require('../utils/LCARSEmbedCreator.js');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('play')
	.setDescription('Play whatever comes up first. Good luck!')
	.addStringOption(option =>
		option.setName('query')
		.setDescription('Search query')
		.setRequired(true))
		.addIntegerOption(option =>
			option.setName('volume')
			// type: 4,
			.setDescription('Volume (0-10)')
			.setRequired(false)),
			// syntax: '!play {search phrase} [-v XX | -vol XX] [-n X]',
			// arguments: {'-v': 'Volume (0-10)', '-n': 'Which search result to use (1, 2, 3, etc...)'},
			// cooldown: 5,
			// voiceReq: true,
	async execute(interaction) {
		await interaction.deferReply()
		
		// Handle arguments
		const searchQuery = interaction.options.getString('query')
		const vol = interaction.options.getInteger('volume') ?? 5;

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
		
		// Perform Google search for song query (with secret song backdoor)
		async function fetchSongMetadata(searchQuery) {
			var song_url
			var meta;
			try {
				if (searchQuery.toLowerCase() == "tribes" || searchQuery.toLowerCase() == "tribes now") {
					song_url = 'https://www.youtube.com/watch?v=L-uHSx-YrSA';
				} else {
					try {
						const results = await googleIt({
							'limit': 1, 
							'no-display': true, 
							'query': searchQuery + ' site:www.youtube.com'
						});
						// console.log('Results: ' + results);
						song_url = results[0].link
					} catch(e) {
						console.log('Error using "googleIt": ', e);
						return e
					}
				}

				meta = await youtubedl(song_url, {
					dumpSingleJson: true,
					noWarnings: true,
					noCheckCertificates: true,
					preferFreeFormats: true,
					youtubeSkipDashManifest: true
				});

			} catch (error) {
				interaction.reply('Failed to fetch video metadata.');
				console.error(error);
				return;
			}

			return meta;
		}

		meta = await fetchSongMetadata(searchQuery);
		
		// Set up embed object
		const colors = ['#ec0000', '#FFC300', '#008bec']
		const randColor = colors[Math.floor(Math.random() * colors.length)];
		const embed = new EmbedBuilder()
			.setColor(randColor)
			.setAuthor({ name: meta.uploader, url: meta.webpage_url})
			.setTitle(meta.title)
			// .setURL(meta.url)
			// .setDescription()
			.setThumbnail(meta.thumbnail)
			.addFields(
				// { 
					// 	name: meta.author,
					// 	value: `[Watch on YouTube](${meta.url})`
					// 	// value: meta.author 
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
		// embed = LCARSEMbedCreator()

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

		// Shush the audience
		await botSay(connection, 'bot_voice/gbl.quiet.WAV', 5)
		
		player.on(AudioPlayerStatus.Playing, async () => {
			await interaction.editReply({ 
				embeds: [embed], 
			});
		});

		// Play the audio resource
		player.play(resource);
		connection.subscribe(player);
	},
};
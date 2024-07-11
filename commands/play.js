const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType } = require('@discordjs/voice');
const { OpusEncoder } = require('@discordjs/opus');
const googleIt = require('google-it');
const ytdl = require('ytdl-core');
const youtubedl = require('youtube-dl-exec')
 
module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play whatever comes up first. Good luck!')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('Search query')
				.setRequired(true)),
	// syntax: '!play {search phrase} [-v XX | -vol XX] [-n X]',
	// arguments: {'-v': 'Volume (0-10)', '-n': 'Which search result to use (1, 2, 3, etc...)'},
	// cooldown: 5,
	// voiceReq: true,
	async execute(interaction) {
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
		
		// Handle arguments
		const searchQuery = interaction.options.getString('query')
		const vol = interaction.options.getString('volume') ?? 5;
		
		// Perform Google search for song query (with secret song backdoor)
		var songInfo
		if (searchQuery.toLowerCase() == "tribes" || searchQuery.toLowerCase() == "tribes now") {
			songInfo = await ytdl.getInfo('https://www.youtube.com/watch?v=L-uHSx-YrSA');
		} else {
			googleIt({'limit': useResult, 'no-display': true, 'query': searchQuery + ' site:www.youtube.com'})
			.then(async results => {
				console.log('Results: ' + results);
				// const urlLib = require('url');
				try {
					songInfo = await ytdl.getInfo(results[0].link);
				} catch(error) {
					console.error('Error getting song: ', error);
				}
			})
			.catch(e => {
				console.log('Error using "googleIt": ', e);
			})
		}
		
		// Pull video metadata
		const song = {
			title: songInfo.videoDetails.title,
			author: songInfo.videoDetails.author.name,
			url: songInfo.videoDetails.video_url,
			thumbnail: songInfo.videoDetails.thumbnails[0]['url'].split('?')[0],
			formats: songInfo.formats,
			duration: new Date(songInfo.videoDetails.lengthSeconds * 1000).toISOString().substr(11, 8),
		};
		
		// Set up embed object
		const colors = ['#ec0000', '#FFC300', '#008bec']
		const randColor = colors[Math.floor(Math.random() * colors.length)];
		const newEmbed = new EmbedBuilder()
		.setColor(randColor)
		.setAuthor({ name: song.author, iconURL: song.thumbnail, url: song.url})
		.setTitle(song.title)
		// .setURL(song.url)
		// .setDescription()
		// .setThumbnail(song.thumbnail)
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
					value: song.duration,
					inline: true 
				},
			)
		// .addField('This was a risky play!', `${message.member.displayName} may have played something unexpected.`, false);
		// .setImage('https://i.imgur.com/wSTFkRM.png')
		// .setTimestamp()
		// .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');
		
		replyMessage = await interaction.reply({ 
			embeds: [newEmbed], 
			// files: [song.thumbnail]
		});
		
		// const resource = createAudioResource(ytdl('https://www.youtube.com/watch?v=L-uHSx-YrSA', 
		// 	{ filter: 'audioonly' }), 
		// 	{ volume: 11/10 })
		// player.play(resource);
		// connection.subscribe(player);
		// player.on(AudioPlayerStatus.Idle, () => {
			// 	connection.destroy();
			// });	
			
			// dispatcher = connection
			// 	// .play(ytdl(song.url, { filter: format => format.container === 'mp4' }), { volume: vol/10 })
			// 	.play(ytdl(song.url, { filter: 'audioonly' }), { volume: vol/10 })
			// 	.on("finish", () => {
				// 		dispatcher.destroy();
				// 	})
				// 	.on("error", error => console.error(error));
				// Create an audio resource



		try {
			var resource
			// const stream = await ytdl(song.url, { filter: format => format.container === 'mp4' })
			const stream = await youtubedl.exec(song.url, {
				extractAudio: true,
				audioQuality: 10,
				// dumpSingleJson: true,
				noWarnings: true,
				audioFormat: 'mp3',
				//audioQuality: 0,
				noCheckCertificate: true,
				preferFreeFormats: true,
				youtubeSkipDashManifest: true,
				referer: 'https://google.com'
			}).then(output => console.log(output)
			).catch(err => console.error(err));

			resource = createAudioResource(stream)

			// resource.volume.setVolume(vol / 10);

			// Create an audio player
			const player = createAudioPlayer();	

			// Play the audio resource
			connection.subscribe(player);
			player.play(resource);
		} catch(e) {
			console.error(e)
		}

        // Disconnect from the voice channel after the audio is finished
        // player.on(AudioPlayerStatus.Idle, () => {
        //     connection.destroy();
        // });	

	},
};

// async function getVidInfo(results, tries) {
// 	try {

// 		console.log("Found a song!");
// 		return(song);
// 	} catch {
// 		++tries;
// 		try {
// 			console.log("Couldnt find a song....(" + tries + " tries)");
// 			getVidInfo(results, tries);
// 			if (tries >= 6) throw "error";
// 		} catch(error) {
// 			return;
// 		}
// 		return;
// 	}
// }
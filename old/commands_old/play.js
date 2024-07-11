const Discord = require("discord.js");
const googleIt = require('google-it');
const ytdl = require('ytdl-core');
 
module.exports = {
	name: 'play',
	description: 'Play whatever comes up first. Good luck!',
	syntax: '!play {search phrase} [-v XX | -vol XX] [-n X]',
	arguments: {'-v': 'Volume (0-10)', '-n': 'Which search result to use (1, 2, 3, etc...)'},
	cooldown: 5,
	voiceReq: true,
	async execute(message, client, argsString) {
		var connection = client.voice.connections.get(message.guild.id);
		if (connection) {
			// Do nothing
		} else {
			connection = await message.member.voice.channel.join();
		}
		
		const args = argsString.split(' -');
		const searchQuery = args[0];
		var useResult = 5;

		if (args[0] === '') {
			message.channel.send('You must supply a valid search query before including arguments.');
			return;
		} else {
			args.shift(); // Remove hyperlink from arguments then parse remaining arguments as normal

			if (args.length) {
				args.forEach(arg => {
					arg = Array.from(arg.trim().split(' ')); // Multi-input arguments are split into array elements for easy access
					// Check the first element of the arg array to see what the argument is
					if (arg[0] == 'v' || arg[0] == 'vol') {
						// Some arguments may have additional parameters which will be stored as further array elements
						volCheck = parseFloat(arg[1]);
						if (isNaN(volCheck)) {
							message.channel.send('The volume option requires a valid number to be supplied.');
						} else if (volCheck < 0 || volCheck > 10) {
							message.channel.send('The volume option requires a value between 0 and 10.');
						} else {
							vol = volCheck;
						}
					
					} else if (arg[0] == 'n') {
						useResult = parseInt(arg[1]);

					} else {
						message.channel.send(`Argument -${arg[0]} is invalid.`);
					}
				});
				
			} else {
				// Default behavior
			}
		}

		if (searchQuery.toLowerCase() == "tribes" || searchQuery.toLowerCase() == "tribes now") {
			const dispatcher = connection
			.play(ytdl('https://www.youtube.com/watch?v=L-uHSx-YrSA', { filter: 'audioonly' }), { volume: 11/10 })
			.on("finish", () => {
				dispatcher.destroy();
			})
			.on("error", error => console.error(error));
		} else {
			googleIt({'limit': useResult, 'no-display': true, 'query': searchQuery + ' site:www.youtube.com'}).then(async results => {
				console.log('Results: ' + results);
				var vol = 5;
				const urlLib = require('url');
				var songInfo = '';
				var song = '';

				try {
					songInfo = await ytdl.getInfo(results[0].link);
					song = {
						title: songInfo.videoDetails.title,
						author: songInfo.videoDetails.author.name,
						url: songInfo.videoDetails.video_url,
						thumbnail: songInfo.videoDetails.thumbnails[0]['url'].split('?')[0],
						formats: songInfo.formats,
						duration: new Date(songInfo.videoDetails.lengthSeconds * 1000).toISOString().substr(11, 8),
					};
				} catch(error) {
					console.error(error);
					message.reply('Error executing command. Maybe the URL was bad? Remember, this only works for YouTube videos.');
					return;
				}
		
				


				const colors = ['#ec0000', '#FFC300', '#008bec']
				const randColor = colors[Math.floor(Math.random() * colors.length)];
				
				const newEmbed = new Discord.MessageEmbed()
				.setColor(randColor)
				.setAuthor(song.author)
				.setTitle(song.title)
				.setURL(song.url)
				// .setDescription()
				.setThumbnail(song.thumbnail)
				.addFields(
					// { 
						// 	name: song.author,
						// 	value: `[Watch on YouTube](${song.url})`
						// 	// value: song.author 
						// },
						{
							name: 'Requester',
							value: message.member.displayName,
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
				.addField('This was a risky play!', `${message.member.displayName} may have played something unexpected.`, false);
				// .setImage('https://i.imgur.com/wSTFkRM.png')
				// .setTimestamp()
				// .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');
				
				message.channel.send(newEmbed);
				
				dispatcher = connection
					// .play(ytdl(song.url, { filter: format => format.container === 'mp4' }), { volume: vol/10 })
					.play(ytdl(song.url, { filter: 'audioonly' }), { volume: vol/10 })
					.on("finish", () => {
						dispatcher.destroy();
					})
					.on("error", error => console.error(error));

			}).catch(e => {
				console.log(e);
				// any possible errors that might have occurred (like no Internet connection)
			})
		}
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
const Discord = require("discord.js");

module.exports = {
	name: 'play',
	description: 'Make LCARS play audio from a YouTube video.',
	syntax: '!play {URL} [-v XX | -vol XX]',
	arguments: {'-v': 'Volume (0-10)'},
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
		if (args[0] === '') {
			message.channel.send('You must supply a valid link before including arguments');
			return;
		}

		var vol = 5;
		const ytdl = require('ytdl-core');
		const urlLib = require('url');
		var songInfo = '';
		var song = '';
		try {	
			songInfo = await ytdl.getInfo(args[0]);	
			song = {
				title: songInfo.videoDetails.title,
				author: songInfo.videoDetails.author.name,
				url: songInfo.videoDetails.video_url,
				thumbnail: songInfo.videoDetails.thumbnails[0]['url'].split('?')[0],
				formats: songInfo.formats,
				duration: new Date(songInfo.videoDetails.lengthSeconds * 1000).toISOString().substr(11, 8),
			};
		} catch (error) {
			console.error(error);
			message.reply('Error executing command. Maybe the URL was bad? Remember, this only works for YouTube videos.');
			return;
		}


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
					
				} else {
					message.channel.send(`Argument -${arg[0]} is invalid.`);
				}
			});
			
		} else {
			// Default behavior
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
					value: message.author.username,
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
		);
		// .addField('Inline field title', 'Some value here', true)
		// .setImage('https://i.imgur.com/wSTFkRM.png')
		// .setTimestamp()
		// .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');
		
		message.channel.send(newEmbed);
		
		dispatcher = connection.play(ytdl(song.url, { filter: format => format.container === 'mp4' }), { volume: vol/10 })
		.on("finish", () => {
			dispatcher.destroy();
		})
		.on("error", error => console.error(error));
	},
};
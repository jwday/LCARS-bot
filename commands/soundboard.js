const fs = require(`fs`);
const Discord = require("discord.js");

module.exports = {
	name: 'soundboard',
	description: 'Make a sound board in the channel.',
	syntax: '!soundboard [-v XX | -vol XX]',
	arguments: {'-v': 'Volume (0-10)'},
	cooldown: 20,
	voiceReq: true,
	async execute(message, client, argsString) {
		// get guild from message?
		// how do you make different client.on events for different guilds?
		// Right now, client.on makes an event for all guilds...at least when it comes to reacts
		var connection = client.voice.connections.get(message.guild.id);
		if (connection) {
			// Do nothing
		} else {
			connection = await message.member.voice.channel.join();
		}
		
 		// Delete the old soundboard, if it exists at all
		try {
			var oldSoundboardID = client.soundboards.get(message.guild.id);
			message.channel.messages.fetch(oldSoundboardID).then(msga => msga.delete());
		} catch {
			// No old soundboard to delete
		}

		// Handle arguments
		var vol = 5;
		const soundsDir = `${__dirname}/../sounds/`;
		const args = argsString.split('-').slice(1);

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


		// Create the "soundboard", which is going to be an embed object with emoji reacts applied to it.
		// LCARS will register a user emoji react, play the appropriate sound, then return it to a count of 1.
		// Ideally would prefer to use some sort of "set react count" rather than "remove one react" function.
		const spiffThumb = `${__dirname}/../misc/spiffSmall.png`;

		const newEmbed = new Discord.MessageEmbed()
			.attachFiles([spiffThumb])
			.setAuthor('@Magellanic#9654', 'attachment://spiffSmall.png')
			.setTitle('A Discord Sound Board')
			// .setURL(song.url)
			.setDescription(`React with one of the emoji to play a pre-programmed sound. Go slow -- there's about a 1/2-second delay.\n**Volume:** ${vol}/10`)
			.setThumbnail('')
			.addFields(
				{
					name: 'Shazbot',
					value: ':poop:',
					inline: true
				},
				{ 
					name: 'Yardsale', 
					value: ':triangular_flag_on_post:',
					inline: true 
				},
				{ 
					name: 'Rock Out', 
					value: ':boom:',
					inline: true 
				},
				{ 
					name: 'Trees', 
					value: '<:tree:821588077574094858>',
					inline: true 
				},
				{ 
					name: 'Cena', 
					value: ':men_wrestling:',
					inline: true 
				},
				{
					name: 'Greet', 
					value: ':wave:',
					inline: true 
				}
			);
		// .addField('Inline field title', 'Some value here', true)
		// .setImage('https://i.imgur.com/wSTFkRM.png')
		// .setTimestamp()
		// .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');
		const soundboardMsg = await message.channel.send(newEmbed);
		await soundboardMsg.react('💩')
			.then(() => soundboardMsg.react('🚩'))
			.then(() => soundboardMsg.react('💥'))
			.then(() => soundboardMsg.react('<:tree:821588077574094858>'))
			.then(() => soundboardMsg.react('🤼‍♂️'))
			.then(() => soundboardMsg.react('👋'))
			.then(client.soundboards.set(message.guild.id, soundboardMsg.id)) // Key the soundboard message ID to the Guild ID

		// var soundboardMsgID = soundboardMsg.id;
		// console.log(`soundboard GuildID: ${message.guild.id}`);
		// console.log(`soundboardMessageID: ${soundboardMsgID}`);
		// console.log(message.channel.messages.fetch(oldSoundboardID))

		  
		// Keys must be unique in javascript, so this is a good way (i think) to keep track of the message which
		// corresponds to the soundboard in each guild, and it means each guild will only be able to have one
		// message acting as a soundboard (code checks this condition below)

		var reaction = '';
		var user = '';
		
		var soundFiles_shazbot = fs.readdirSync(soundsDir+'shazbots/', (err, files) => {
			files.forEach(file => {
				soundFiles_shazbot.push(file);
			});
		});

		var soundFiles_greet = fs.readdirSync(soundsDir+'join_voice/', (err, files) => {
			files.forEach(file => {
				soundFiles_greet.push(file);
			});
		});
		
		async function msgReactListener(reaction, user) {
			if (reaction.me) {
				// Prevents bot from calling sounds while adding reacts to message
				return;
			} else if (!(reaction.message.id === client.soundboards.get(reaction.message.guild.id))) {
				// If the message that was reacted to corresponds to the message ID stored in client.soundboards
				return;
			} else {
				if (reaction._emoji.name === '💩') {
					var snd = 'shazbots/' + soundFiles_shazbot[Math.floor(Math.random() * soundFiles_shazbot.length)];
				} else if (reaction._emoji.name === '🚩') {
					var snd = "yardsale.WAV";
				} else if (reaction._emoji.name === '💥') {
					var snd = "MA2.wav";
				} else if (reaction._emoji.name === 'tree') {
					var snd = "smoke.mp3";
				} else if (reaction._emoji.name === '🤼‍♂️') {
					var snd = "johncena.ogg";
				} else if (reaction._emoji.name === '👋') {
					var snd = 'join_voice/' + soundFiles_greet[Math.floor(Math.random() * soundFiles_greet.length)];
				} else {
					return;
				}

				// The following block checks to make sure the user who reacted is in the same voice
				// channel as the bot by comparing the VoiceChannelID of the user and the bot based
				// on the Guild ID of the react and the Guild ID of the user who reacted.
				const userID = user.id;  // Return user who reacted
				const guildID = reaction.message.guild.id;  // Return ID for guild that react occurred in
				const guildInfo = client.guilds.cache.get(guildID); // Get info for guild that react occurred in
				
				var clientChannelID = '';
				try {  // This will fail if the client was disconnected from a voice channel prior to a react
					clientChannelID = client.voice.connections.get(guildID).channel.id;  // Get channel ID for the voice channel the client is logged into
				} catch {
					connection = await message.member.voice.channel.join();  // Reconnect if fails
					clientChannelID = client.voice.connections.get(guildID).channel.id;  // Now get the channel ID
				}
				const userChannelID = guildInfo.voiceStates.cache.get(userID).channelID;  // Get channel ID for the voice channel the user is logged into

				if (clientChannelID === userChannelID) {  // If the user is logged into the same channel as the client
					dispatcher = client.voice.connections.get(reaction.message.guild.id).play(soundsDir + snd, { volume: vol/10 });
					dispatcher.on("finish", () => {
						dispatcher.destroy();
					})
					dispatcher.on("error", error => console.error(error));
				} else if (!userChannelID) {
					return console.log('A user tried to use the soundboard but wasn\'t in a voice channel')
				} else {
					return console.log('A user tried to use the soundboard but wasn\'t in the correct voice channel')
				}
			}
		}

		// Only set up one listener
		if (!client._events.messageReactionAdd) {
			client.on('messageReactionAdd', msgReactListener);
		}
		// Its not bulletproof. You could conceivably react to a DIFFERENT message than the one the bot created.
		// Maybe I should keep track of message IDs too and only allow playback for reacts which occur on those messages.
	},
};
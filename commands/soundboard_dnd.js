const fs = require(`fs`);
const Discord = require("discord.js");
// const { registerFont, Canvas } = require('canvas');
const path = require('path');
const Canvas = require('canvas');
// const registerFront = require('canvas');
Canvas.registerFont(`${__dirname}/../swiss-911-ultra-compressed-bt.ttf`, { family: 'Swiss911' });

// require('canvas-5-polyfill')

module.exports = {
	name: 'dndsoundboard',
	description: 'Bard sounds for D&D.',
	syntax: '!dndsoundboard [-v XX | -vol XX]',
	arguments: {'-v': 'Volume (0-10)'},
	cooldown: 5,
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
		const colorsLCARS = ['#FFCC99', '#CC99CC', '#9999CC']
		const randColor = colorsLCARS[Math.floor(Math.random() * colorsLCARS.length)];
		const spiffThumb = `${__dirname}/../misc/spiffSmall.png`;

		// // Here we'll create an LCARS-like object to display with the embed
		// const randSelectButtonSty = new Promise((resolve, reject) => {
		// 	const c = Canvas.createCanvas(150, 450);
		// 	const ctx = c.getContext('2d');
	
		// 	var W = c.width;
		// 	var H = c.height;
		// 	// Slotted wide rounded circle with black text
		// 	function buttonSty1() {
		// 		// console.log('style 1')
		// 		ctx.beginPath();
		// 		ctx.arc(W/2, W/2, W/2, 0, Math.PI, true);
		// 		ctx.lineTo(0, 0.75*W, 0);
		// 		ctx.lineTo(W, 0.75*W, 0);
		// 		ctx.lineTo(W, W/2, 0);
		// 		ctx.closePath();
		// 		ctx.fillStyle = randColor;
		// 		ctx.fill();
		// 		ctx.stroke();
				
		// 		ctx.beginPath();
		// 		ctx.moveTo(0, 1.125*W);
		// 		ctx.lineTo(0, H-W/2);
		// 		ctx.arc(W/2, H-W/2, W/2, Math.PI, 0, true);
		// 		ctx.lineTo(W, 1.125*W);
		// 		ctx.closePath();
		// 		ctx.fillStyle = randColor;
		// 		ctx.fill();
		// 		ctx.stroke();
		// 		ctx.save();
				
		// 		ctx.rotate(90*Math.PI/180);
		// 		ctx.textAlign = 'center';
		// 		ctx.fillStyle = 'black';
		// 		ctx.font = `${W}px Swiss911`;
		// 		ctx.fillText(`SB${message.id.slice(-2)}`, 65*H/100, -W/8);
		// 	}
	
		// 	// Wide-slotted rounded circle surrounding colored text
		// 	function buttonSty2() {
		// 		// console.log('style 2')
		// 		ctx.beginPath();
		// 		ctx.arc(W/2, W/2, W/2, 0, Math.PI, true);
		// 		ctx.lineTo(0, 0.55*W, 0);
		// 		ctx.lineTo(W, 0.55*W, 0);
		// 		ctx.lineTo(W, W/2, 0);
		// 		ctx.closePath();
		// 		ctx.fillStyle = randColor;
		// 		ctx.fill();
		// 		ctx.stroke();
				
		// 		ctx.beginPath();
		// 		ctx.moveTo(0, H-0.55*W);
		// 		ctx.lineTo(0, H-W/2);
		// 		ctx.arc(W/2, H-W/2, W/2, Math.PI, 0, true);
		// 		ctx.lineTo(W, H-0.55*W);
		// 		ctx.closePath();
		// 		ctx.fillStyle = randColor;
		// 		ctx.fill();
		// 		ctx.stroke();
		// 		ctx.save();
				
		// 		ctx.rotate(90*Math.PI/180);
		// 		ctx.textAlign = 'center';
		// 		ctx.fillStyle = '#FFCC99';
		// 		ctx.font = `${1.2*W}px Swiss911`;
		// 		ctx.fillText(`SB${message.id.slice(-2)}`, 50*H/100, -W/15);
		// 	}
		// 	const buttonStys = [buttonSty2, buttonSty1]
		// 	const randNum = Math.random()
		// 	const select = Math.floor(randNum * buttonStys.length)
		// 	buttonStys[select]();
		// 	resolve(c);
		// });

		const attachment = `${__dirname}/../misc/dnd.png`;
		// await randSelectButtonSty
		// .then(c => attachment = new Discord.MessageAttachment(c.toBuffer(), 'LCARS_thumb.png'));

		const randSideColor = colorsLCARS[Math.floor(Math.random() * colorsLCARS.length)];

		const newEmbed = new Discord.MessageEmbed()
			.setColor(randSideColor)
			.attachFiles([attachment])
			// .attachFiles([spiffThumb])
			// .setAuthor('A Discord Sound Board', 'attachment://LCARS_thumb.png')
			.setTitle(`BARD SOUNDS`)
			// .setImage('attachment://LCARS_thumb.png')
			.setThumbnail('attachment://dnd.png')
			.setDescription(`React with one of the emoji to play a pre-programmed sound. Note there's about a 1/2-second delay.\n**Volume:** ${vol}/10`)
			// .setURL(song.url)
			.addFields(
				{
					name: 'Bagpipes',
					value: ':poop:',
					inline: true
				},
				{ 
					name: 'Banjo', 
					value: ':triangular_flag_on_post:',
					inline: true 
				},
				{ 
					name: 'Bassoon', 
					value: ':boom:',
					inline: true 
				},
				{ 
					name: 'Bongos', 
					value: '<:startrek:823644985173737552>',
					inline: true 
				},
				{ 
					name: 'Bass', 
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
			.then(() => soundboardMsg.react('<:startrek:823644985173737552>'))
			.then(() => soundboardMsg.react('🤼‍♂️'))
			.then(() => soundboardMsg.react('👋'))
			.then(client.soundboards.set(message.guild.id, soundboardMsg.id)) // Key the soundboard message ID to the Guild ID
		  
		// Keys must be unique in javascript, so this is a good way (i think) to keep track of the message which
		// corresponds to the soundboard in each guild, and it means each guild will only be able to have one
		// message acting as a soundboard (code checks this condition below)

		var reaction = '';
		var user = '';
		
		// var soundFiles_bardmusic = fs.readdirSync(soundsDir+'bard_music/', (err, files) => {
		// 	files.forEach(file => {
		// 		soundFiles_bardmusic.push(file);
		// 	});
		// });

		var soundFiles_greet = fs.readdirSync(soundsDir+'join_voice/', (err, files) => {
			files.forEach(file => {
				soundFiles_greet.push(file);
			});
		});
		
		async function msgReactListener(reaction, user) {
			// The following block checks to make sure the user who reacted is in the same voice
			// channel as the bot by comparing the VoiceChannelID of the user and the bot based
			// on the Guild ID of the react and the Guild ID of the user who reacted.
			const userID = user.id;  // Return user who reacted
			const guildID = reaction.message.guild.id;  // Return ID for guild that react occurred in
			const guildInfo = client.guilds.cache.get(guildID); // Get info for guild that react occurred in
			const userChannelID = guildInfo.voiceStates.cache.get(userID).channelID;  // Get channel ID for the voice channel the user is logged into
			
			if (reaction.me) {
				// Prevents bot from calling sounds while adding reacts to message
				return;
			} else if (!(reaction.message.id === client.soundboards.get(reaction.message.guild.id))) {
				// If the message that was reacted to is not the message ID stored in client.soundboards
				return;
			} else if (!userChannelID) {
				// return console.error('A user tried to use the soundboard but wasn\'t in a voice channel')
			} else {
				var clientChannelID = '';
				try {  // Get channel ID for the voice channel the client is logged into
					// This will fail if the client was disconnected from a voice channel prior to a react
					clientChannelID = client.voice.connections.get(guildID).channel.id; 
				} catch {
					try {  // Connect to the user's voice channel
						// This will also prevent the bot from getting pulled to whichever channel the user is in when they react.
						// The bot will only join the user channel if it is not already connected to a channel.
						connection = await message.member.voice.channel.join();  
						// Now get the channel ID
						clientChannelID = client.voice.connections.get(guildID).channel.id;
					} catch {
						// return console.error('Unable to connect to voice');
					}
				}

				if (clientChannelID !== userChannelID) {  // If the user is logged into the same channel as the client
					// return console.error('A user tried to use the soundboard but wasn\'t in the correct voice channel')
				} else {
					if (reaction._emoji.name === '💩') {
						var snd = 'bard_music/bagpipes1.ogg';
					} else if (reaction._emoji.name === '🚩') {
						var snd = 'bard_music/banjo1.ogg';
					} else if (reaction._emoji.name === '💥') {
						var snd = 'bard_music/bassoon1.ogg';
					} else if (reaction._emoji.name === 'startrek') {
						var snd = 'bard_music/bongos1.ogg';
					} else if (reaction._emoji.name === '🤼‍♂️') {
						var snd = 'bard_music/doublebass1.ogg';
					} else if (reaction._emoji.name === '👋') {
						var snd = 'join_voice/' + soundFiles_greet[Math.floor(Math.random() * soundFiles_greet.length)];
					} else {
						return;
					}

					const dispatcher = client.voice.connections
						.get(reaction.message.guild.id)
						.play(soundsDir + snd, { volume: vol/10 })
						.on("finish", () => {
							dispatcher.destroy();
						})
						.on("error", error => console.error(error));
				}
			}
		}

		// Only set up one listener. This could potentially interfere with other listeners down the road.
		// Sure does. Now that I have two soundboards (one reg, one D&D), the listener doesn't get replaced so it continues to play the old sounds
		if (!client._events.messageReactionAdd) {
			client.on('messageReactionAdd', msgReactListener);
		}
	},
};
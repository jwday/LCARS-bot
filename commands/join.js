const fs = require("fs");
const joinSounds = './sounds/join_voice/';

module.exports = {
	name: 'join',
	description: 'Join a voice channel.',
	async execute(message, connection, args) {
		if(connection) {
			// Do nothing
		} else {
			var connection = await message.member.voice.channel.join()
			if (!args.length) {
				connection.play(joinSounds + "gbl.hi_bot.wav", { volume: 0.5 });
			} else if (args[0] === 'rand') {
				var soundFiles = fs.readdirSync(joinSounds, (err, files) => {
					files.forEach(file => {
						soundFiles.push(file);
					});
				});
				
				var randSound = soundFiles[Math.floor(Math.random() * soundFiles.length)];
				connection.play(joinSounds + randSound, { volume: 0.5 });
			} else {
				connection = '';
				message.channel.send('Argument not recognized');
			}
		}

		return connection;
	},
};
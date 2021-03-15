const fs = require("fs");
const leaveSounds = './sounds/leave_voice/';

module.exports = {
	name: 'leave',
	description: 'Leave a voice channel.',
	async execute(message, connection, args) {
		if(connection) {
			if (!args.length) {
				connection.play(leaveSounds + "gbl.bye_bot.wav", { volume: 0.5 });
			} else if (args[0] === 'rand') {
				var soundFiles = fs.readdirSync(leaveSounds, (err, files) => {
					files.forEach(file => {
						soundFiles.push(file);
					});
				});
				
				var randSound = soundFiles[Math.floor(Math.random() * soundFiles.length)];
				connection.play(leaveSounds + randSound, { volume: 0.5 });
			} else {
				connection = '';
				message.channel.send('Argument not recognized');
			}
			await new Promise(r => setTimeout(r, 1000)); // Sleep?
			connection.disconnect();
		} else {
			// Do nothing
		}

		return connection = '';;
	},
};
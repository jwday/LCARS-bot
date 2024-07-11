const fs = require(`fs`);

module.exports = {
	name: 'leave',
	description: 'Make LCARS leave a voice channel.',
	syntax: '!leave [-v XX | -vol XX] [-r | -rand]',
	arguments: {'-v': 'Volume (0-10)', '-r': 'Randomize voice'},
	voiceReq: false,
	async execute(message, client, argsString) {
		var connection = client.voice.connections.get(message.guild.id);
		if (connection) {
			var vol = 5;
			var snd = "gbl.bye_bot.wav";
			const soundsDir = `${__dirname}/../sounds/leave_voice/`;

			const args = argsString.split('-').slice(1);

			if (args.length) {
				args.forEach(arg => {
					arg = Array.from(arg.trim().split(' ')); // Multi-input arguments are split into array elements for easy access
					
					// Check the first element of the arg array to see what the argument is
					if (arg[0] == 'r' || arg[0] == 'rand') {
						var soundFiles = fs.readdirSync(soundsDir, (err, files) => {
							files.forEach(file => {
								soundFiles.push(file);
							});
						});
						snd = soundFiles[Math.floor(Math.random() * soundFiles.length)];
						
					} else if (arg[0] == 'v' || arg[0] == 'vol') {
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

			dispatcher = connection.play(soundsDir + snd, { volume: vol/10 })
			.on("finish", async () => {
				dispatcher.destroy();
				connection.disconnect();
			})
			.on("error", error => console.error(error));
			
		} else {
			// Do nothing
		}
	},
};
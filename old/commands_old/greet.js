const fs = require(`fs`);

module.exports = {
	name: 'greet',
	description: 'Make LCARS say hello.',
	syntax: '!greet [-v XX | -vol XX] [-r | -rand] [-c | -chat]',
	arguments: {'-v': 'Volume (0-10)', '-r': 'Randomize voice', '-c': 'Display in chat'},
	cooldown: 5,
	voiceReq: true,
	async execute(message, client, argsString) {
		var connection = client.voice.connections.get(message.guild.id);
		if (connection) {
			// Do nothing
		} else {
			connection = await message.member.voice.channel.join();
		}

		var vol = 5;
		var snd = "gbl.hi_bot.wav";
		const soundsDir = `${__dirname}/../sounds/join_voice/`;

		var args = '';
		try {
			args = argsString.split('-').slice(1);
		} catch {
			
		}

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

				} else if (arg[0] == 'c' || arg[0] == 'chat') {
					message.channel.send(':wave: Hi.');
					
				} else {
					message.channel.send(`Argument -${arg[0]} is invalid.`);
				}
			});

		} else {
			// Default behavior
		}
		
		dispatcher = connection.play(soundsDir + snd, { volume: vol/10 });
		dispatcher.on("finish", () => {
			dispatcher.destroy();
		})
		dispatcher.on("error", error => console.error(error));
	},
};
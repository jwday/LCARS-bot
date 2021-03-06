module.exports = {
	name: 'johncena',
	description: 'And his name is...',
	syntax: '!johncena [-v XX | -vol XX] [-c | -chat]',
	arguments: {'-v': 'Volume (0-10)', '-c': 'Display in chat'},
	cooldown: 6,
	voiceReq: true,
	async execute(message, client, argsString) {
		var connection = client.voice.connections.get(message.guild.id);
		if (connection) {
			// Do nothing
		} else {
			connection = await message.member.voice.channel.join();
		}

		var vol = 5;
		var snd = "johncena.ogg";
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

				} else if (arg[0] == 'c' || arg[0] == 'chat') {
					message.channel.send(':loudspeaker:  :regional_indicator_j: :regional_indicator_o: :regional_indicator_h: :regional_indicator_n:    :regional_indicator_c: :regional_indicator_e: :regional_indicator_n: :regional_indicator_a: :boom:');
					
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
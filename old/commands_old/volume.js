const Discord = require("discord.js");

module.exports = {
	name: 'volume',
	description: 'Change LCARS\' volume while he\'s playing.',
	syntax: '!volume {value}',
	cooldown: 2,
	voiceReq: true,
	async execute(message, client, argsString) {
		const args = argsString.split(' -');
		if (args[0] === '') {
			message.channel.send('You must supply a value.');
			return;
		} else if (args[0] < 1 || args[0] > 10) {
			// message.channel.send('You must supply a value between 1 and 10. Use !stop to stop playback altogether.');
			// return;
		}

		var vol = args[0];
		try {	
			message.channel.send('Setting volume to ' + vol + '/10.');
			dispatcher.setVolume(vol/10);
		} catch (error) {
			console.error(error);
			message.reply('Error executing command. Maybe the URL was bad? Remember, this only works for YouTube videos.');
			return;
		}

	},
};
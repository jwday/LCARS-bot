const Discord = require("discord.js");
const ytdl = require('ytdl-core');

module.exports = {
	name: 'tribes',
	description: 'TRIIIEEEEBES',
	syntax: '!tribes',
	arguments: 'None',
	cooldown: 1,
	voiceReq: false,
	async execute(message, client, argsString) {
		var connection = client.voice.connections.get(message.guild.id);
		if (connection) {
			// Do nothing
		} else {
			try {
				connection = await message.member.voice.channel.join();
			} catch {
				// Pass
			}
		}
		
		const msgs = ['**TRIIIEEEEBES!**', '**TRIBES!**', '**TRIBES TRIBES TRIBES**', '**trobes**', '**cru**', '**TRIEBS**', '**TRIIEEEEBS WHEN?**'];
		const rand_msg = msgs[Math.floor(Math.random() * msgs.length)];
		message.channel.send(rand_msg);

		if (connection) {
			const dispatcher = connection
			.play(ytdl('https://www.youtube.com/watch?v=L-uHSx-YrSA', { filter: 'audioonly' }), { volume: 11/10 })
			.on("finish", () => {
				dispatcher.destroy();
			})
			.on("error", error => console.error(error));
			// message.channel.send('**TRIBES. TRIBES. TRIBES. TRIBES.**');
		} else {
			// Pass
		}
	},
};
module.exports = {
	name: 'stop',
	description: 'Stop all of LCARS\' playback.',
	arguments: 'None',
	voiceReq: false,
	async execute(message, client, argsString) {
		if (client.voice.connections.get(message.guild.id)) {
			dispatcher.destroy();
		} else {
			// Do nothing
		}
	},
};
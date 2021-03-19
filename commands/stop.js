module.exports = {
	name: 'stop',
	description: 'Stop all of LCARS\' playback.',
	arguments: 'None',
	voiceReq: false,
	async execute(message, client, argsString) {
		var connection = client.voice.connections.get(message.guild.id);
		if (connection.player.dispatcher) {
			connection.player.dispatcher.destroy();
		} else {
			// Do nothing
		}
	},
};
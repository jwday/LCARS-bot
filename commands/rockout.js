const soundsDir = './sounds/';

module.exports = {
	name: 'rockout',
	description: 'Woooooo! Rock out!',
	async execute(message, connection, args) {
		if(connection) {
			// Do nothing
		} else {
			var connection = await message.member.voice.channel.join()
		}
	
		connection.play(soundsDir + "MA2.wav", { volume: 0.5 });
		message.channel.send(':boom: :boom:  **ROCK OUT**  :boom:  :boom: ');
		return connection;
	},
};
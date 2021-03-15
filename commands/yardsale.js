const soundsDir = './sounds/';

module.exports = {
	name: 'yardsale',
	description: 'Yard sale!',
	async execute(message, connection, args) {
		if(connection) {
			// Do nothing
		} else {
			var connection = await message.member.voice.channel.join()
		}
	
		connection.play(soundsDir + "yardsale.WAV", { volume: 0.5 });
		message.channel.send(':triangular_flag_on_post: :triangular_flag_on_post:  **YARD SALE**  :triangular_flag_on_post:  :triangular_flag_on_post: ');
		return connection;
	},
};
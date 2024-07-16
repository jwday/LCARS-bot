const { createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');

async function botSay(connection, soundfile, volume) {
	// Choose a sound to play
	const soundsDir = `${__dirname}/../sounds/`;

	// Create an audio player
	const player = createAudioPlayer();
	
	// Create an audio resource
	const resource = createAudioResource(soundsDir + soundfile, {
		inlineVolume: true
	});
	resource.volume.setVolume(volume / 10);

	// Play the audio resource
	await new Promise(r => setTimeout(r, 1000));
	console.log('Playing ' + soundsDir + soundfile)
	player.play(resource);
	connection.subscribe(player);
	
	player.on(AudioPlayerStatus.Stopped, () => {
		player.stop()
	});
	await new Promise(r => setTimeout(r, 1000));
	return;
};

module.exports = { botSay };
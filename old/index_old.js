const Discord = require("discord.js");
const { prefix, token } = require("./myconfig.json")

const client = new Discord.Client();

const ytdl = require("ytdl-core");
const queue = new Map();  // Holds key-value pairs which will store song queue info
const fs = require('fs');
const soundsDir = './sounds/';
const joinSounds = './sounds/join_voice/';
const leaveSounds = './sounds/leave_voice/';

client.once("ready", () => {
	console.log("Ready!");
});

client.once("reconnecting", () => {
	console.log("Reconnecting!");
});

client.once("disconnect", () => {
	console.log("Disconnect!");
});

// Command Handler
client.on("message", async message => {
	// Ignore if message doesn't begin with prefix or if message comes from bot
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	// Ignore if command isn't sent from the correct channel
	// if (message.channel.id !== '718907750645760030') {  // #music-callouts in The Crew
	// if (message.channel.id !== '813245474605760523') {  // #general in D&D
	if (message.channel.id !== '820583136928727041') {  // #general in LCARS_Test
		return message.channel.send("LCARS requires user to issue commands from #music-callouts.");
	}
	
	// const args = message.content.slice(prefix.length).trim().split(/ +/);
	// const command = args.shift().toLowerCase();

	// if (command === 'ping') {
	// 	message.channel.send('Pong.');
	// } else if (command === 'beep') {
	// 	message.channel.send('Boop.');
	// }
	
	const serverQueue = queue.get(message.guild.id);  // If this is the first time this is executed, serverQueue will be undefined

	if (message.content.startsWith(`${prefix}play`)) {
		execute(message, serverQueue);
		return;
	}
	else if (message.content.startsWith(`${prefix}skip`)) {
		skip(message, serverQueue);
		return;
	}
	else if (message.content.startsWith(`${prefix}stop`)) {
		stop(message, serverQueue);
		return;
	}
	else if (message.content.startsWith(`${prefix}yardsale`)) {
		yardsale(message, serverQueue);
		return;
	}
	else if (message.content.startsWith(`${prefix}rockout`)) {
		rockout(message, serverQueue);
		return;
	}
	else if (message.content.startsWith(`${prefix}join`)) {
		joinVoice(message, serverQueue);
		return;
	}
	else if (message.content.startsWith(`${prefix}leave`)) {
		leaveVoice(message, serverQueue);
		return;
	}
	else {
		message.channel.send("Noob. LCARS requires a valid command. Try *play*, *skip*, or *stop*.");
	}
});

async function execute(message, serverQueue) {
	const args = message.content.split(" ");
	const voiceChannel = message.member.voice.channel;
	const permissions = voiceChannel.permissionsFor(message.client.user);

	if (!voiceChannel) {
		return message.channel.send(
			"LCARS requires user to be in a voice channel to play music."
		);
	}

	if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
		return message.channel.send(
			"LCARS requires permission to join and speak in your voice channel."
		);
	}

  	const songInfo = await ytdl.getInfo(args[1]);
  	const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
  	};

  	if (!serverQueue) {
    	const queueConstruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};

		queue.set(message.guild.id, queueConstruct);
		queueConstruct.songs.push(song);

		try {
			var connection = await joinVoice(message, serverQueue);
			queueConstruct.connection = connection;
			play(message.guild, queueConstruct.songs[0]);
		}
		catch (err) {
			console.log(err);
			queue.delete(message.guild.id);
			return message.channel.send(err);
		}
	}
	else {
		serverQueue.songs.push(song);
		return message.channel.send(`LCARS has added ${song.title} to the queue.`);
	}
}

function skip(message, serverQueue) {
	if (!message.member.voice.channel) {
    	return message.channel.send(
      		"LCARS requires you to be in a voice channel to stop the music."
    	);
	}

  	if (!serverQueue) {
    	return message.channel.send("LCARS was unable to skip the song because no queue exists.");
	}
}

function stop(message, serverQueue) {
	if (!message.member.voice.channel) {
    	return message.channel.send(
      		"LCARS requires you to be in a voice channel to stop the music."
    	);
	}

  	if (!serverQueue) {
    	return message.channel.send("LCARS cannot stop what is not playing because no queue exists.");
	}

	serverQueue.connection.dispatcher.end();
	serverQueue.songs = [];
}



function play(guild, song) {
	const serverQueue = queue.get(guild.id);
	
	if (!song) {
		// serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	
	const dispatcher = serverQueue.connection
	.play(ytdl(song.url))
	.on("finish", () => {
		serverQueue.songs.shift();
		play(guild, serverQueue.songs[0]);
	})
	.on("error", error => console.error(error));
	
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
	// dispatcher.setVolume(0.2);
	serverQueue.textChannel.send(`Initializing playback: **${song.title}**`);
}

client.login(token);
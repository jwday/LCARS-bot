const Discord = require("discord.js");
const { prefix, token } = require("./myconfig.json")

const fs = require("fs");
const { join } = require("path");
const commandsDir = "./commands";

const client = new Discord.Client();
client.commands = new Discord.Collection();

var connection = '';

// Build and set all bot commands by looping through all the command files in the commands directory
const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

// Command handler
client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) {
		return;
	} else if (message.channel.id !== '820583136928727041') {  // #general in LCARS_Test
		return message.channel.send('LCARS requires user to issue commands from **#general.**');
	} else if (!message.member.voice.channel) {
		return message.channel.send('LCARS requires user to be in a voice channel to play music.');
	}

	const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) {
		return message.channel.send('**Command not recognized.**');
	}

	try {
		doCommand = async () => {
			connection = await client.commands.get(command).execute(message, connection, args);
		};
		doCommand();		
	} catch (error) {
		console.error(error);
		message.reply('Error executing command.');
	}
});



// Read all the files in the given directory and return a randomly chosen file as a string
// function pickRandSound(soundsDir) {
// 	// Build an array of all the files found
// 	var soundFiles = fs.readdirSync(soundsDir, (err, files) => {
// 		files.forEach(file => {
// 			soundFiles.push(file);
// 		});
// 	});
	
// 	// Randomly choose one file from the array
// 	var randSound = soundFiles[Math.floor(Math.random() * soundFiles.length)];
// 	return randSound;
// }

// var message = "Hello";

// const queue = new Map();  // Holds key-value pairs which will store song queue info
// const serverQueue = queue.get(message);
// console.log("serverQueue is " + serverQueue + "\n");

// if (!serverQueue) {  // TRUE even if serverQueue is undefined (i.e. serverQueue has been declared, but queue.get(message) is undefined because it doesn't exist)
// 	console.log("!serverQueue");
// } else {
	// 	console.log("fin");
	// }

client.login(token);

client.once("ready", () => {
	console.log("Ready!");
});

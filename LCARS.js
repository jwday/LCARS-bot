const path = require('path');
const Discord = require(`discord.js`);
const fs = require(`fs`);
const { prefix, token } = require(`${__dirname}/myconfig.json`)

const commandsDir = `${__dirname}/commands`;

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
client.soundboards = new Discord.Collection();
const { cooldowns } = client;

var guild_and_channel_ids = {'The Crew': ['#music-callouts', '718907750645760030'],
'LCARS Test Server': ['#general', '820583136928727041'],
'D&D': ['#general', '813245474605760523']};

// Build and set all bot commands by looping through all the command files in the commands directory
function setCommands() {
	const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith(".js"));
	for (const file of commandFiles) {
		const command = require(`${commandsDir}/${file}`);
		
		// set a new item in the Collection
		// with the key as the command name and the value as the exported module
		client.commands.set(command.name, command);
	}
	console.log('Commands set.')
}

// A function to execute commands and return the updated connection object
async function doCommand(command, message, client, argsString) {
	await client.commands.get(command).execute(message, client, argsString);
};


// const getAllFiles = function(dirPath, arrayOfFiles) {
// 	files = fs.readdirSync(dirPath);
  
// 	arrayOfFiles = arrayOfFiles || [];
  
// 	files.forEach(function(file) {
// 	  if (fs.statSync(dirPath + "/" + file).isDirectory()) {
// 		arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
// 	  } else {
// 		arrayOfFiles.push(path.join(__dirname, dirPath, "/", file));
// 	  }
// 	})
  
// 	return arrayOfFiles
//   }



// Command handler
client.on('message', async (message) => {
	// Check if the message was intended as a command and if it was issued from the listed valid channel
	if (!message.content.startsWith(prefix) || message.author.bot) {
		return;
	} else if (!Object.values(guild_and_channel_ids).flat().includes(message.channel.id)) {
		message.delete();
		var allowedChannel = guild_and_channel_ids[message.guild.name][0];
		return message.channel.send(`LCARS requires user to issue commands from **${allowedChannel}**`);
	}
	
	// Parse the full command and separate out the arguments
	const fullCommand = message.content.slice(prefix.length).trim()
	const command = fullCommand.split(' ')[0].toLowerCase();
	const argsString = fullCommand.split(' ').slice(1).join(' ');
	
	// Check if it's a valid command
	if (!client.commands.has(command)) {
		message.delete();
		return message.channel.send('**Command not recognized.**');
	} else {
		let voiceReq = client.commands.find(element => element.name === command).voiceReq;
		if (voiceReq && !message.member.voice.channel) {
			message.delete();
			return message.channel.send('LCARS requires user to be in a voice channel to play sounds.');
		}
	}
	
	// Track cooldowns
	const cmdObject = client.commands.get(command);
	
	if (!cooldowns.has(cmdObject.name)) {
		cooldowns.set(cmdObject.name, new Discord.Collection());
	}
	// console.log(cooldowns)
	
	const now = Date.now();
	const timestamps = cooldowns.get(cmdObject.name);
	const cooldownAmount = (cmdObject.cooldown || 1) * 1000;
	
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
		
		if (now < expirationTime) {
			await message.delete();
			const timeLeft = (expirationTime - now) / 1000;
			let msg = await message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${cmdObject.name}\` command.`);

			setTimeout(() => msg.delete(), cooldownAmount);
			return setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
		}
	} else {
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
		// console.log(timestamps);
	}

	
	// Execute the command
	try {
		await doCommand(command, message, client, argsString);
		// console.log(`Server name: ${connection.channel.guild.name}`)
		// console.log(`Server ID: ${connection.channel.guild.id}`)
	} catch (error) {
		console.log('-------------------------------------------------------------------------------------')
		console.error(error);
		console.log('-------------------------------------------------------------------------------------')
		message.channel.send('**Error executing command.**');
	}
	
	// Delete the message from chat to avoid spam
	message.delete();
});

// Auto-greet on channel join
client.on('voiceStateUpdate', async (oldState, newState) => {
	let newChannel = newState.channelID;
	let oldChannel = oldState.channelID;
	// console.log(oldState.guild.id);

	
	if (!oldState.member.user.bot && client.voice.connections.get(oldState.guild.id)) { // check if the bot is the one joining/leaving
		const message = {guild: {id: oldState.guild.id}, member: {voice: ''}};
		const argsString = '';
	
		if (oldChannel === null && newChannel !== null) {
			await new Promise(r => setTimeout(r, 750)); // Sleep?
			await doCommand('greet', message, client, argsString);
		} else if (newChannel === null) {
			await new Promise(r => setTimeout(r, 500)); // Sleep?
			await doCommand('farewell', message, client, argsString);
		}
	}
})

client.login(token);
setCommands();

client.once("ready", () => {
	console.log("Ready!");
});

client.on("guildCreate", async guild => {
	console.log("Joined a new guild: " + guild.name);

	let channelID;
    let channels = guild.channels.cache;

    for (let key in channels) {
        let c = channels[key];
        if (c[1].type === "general") {
            channelID = c[0];
            break;
        }
    }

    let channel = guild.channels.cache.get(guild.systemChannelID || channelID);
	await new Promise(r => setTimeout(r, 2000)); // Sleep?
    channel.send('Greetings. This is the Library Computer Access/Retrieval System, or **LCARS**. I can\'t actually access or retrieve much just yet, but to see what I can do, type `!help`.');
})

// Preamble
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const { token } = require(`${__dirname}/myconfig.json`);		// Store the token in "myconfig.json" which isn't tracked by Git
const { deployCommands } = require(`${__dirname}/deploy-commands`);
const fs = require('fs');
const path = require('path');

// Initialization
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ] 
});

// Set Commands Handler
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
commandFiles.forEach(file => {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
})

// Run once upon connection
client.once('ready', async () => {    
    try {
        // Get the clientID of the bot
        const clientId = client.user.id;

        // Use the fetch method to return a 'GuildManager' object and also the cached info
        const guilds = await client.guilds.fetch();     // Fetches from Discord's server. Do this once!
        const guildsCached = client.guilds.cache        // Cached version of 'guilds' and with extended functionality. Use this going forward for speed.

        // Print a list of every guild the bot is connected to the console
        console.log(`LCARS is installed on the following guilds:`);
        guildsCached.forEach(guild => {
            console.log(` >  ${guild.name}`);
        })

        // Leave every guild
        // guildsCached.forEach(async guild => {
        //     if (guild.available) {
        //         await guild.leave();
        //         console.log(` x: Left ${guild.name}`)
        //     } else {
        //         console.log(` o: Failed to leave ${guild.name}`)
        //     }
        // })

        // Deploy slash commands for each guild
        // await deployCommands(client, guildsCached);

        console.log(`\nReady! Logged in as ${client.user.tag}!`);
    } catch (error) {
        console.error('Failed on startup', error);
    }       
});

// On message
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

// Login
client.login(token);
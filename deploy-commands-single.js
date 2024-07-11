const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./myconfig.json');
const fs = require('node:fs');
const path = require('node:path');


// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);


// Fetch and list the commands that are currently already on the bot
(async () => {
	console.log('\nFetching already-installed commands...');
	try {
		const existingCommands = await rest.get(
			Routes.applicationGuildCommands(clientId, guildId)
		);
		if (existingCommands && existingCommands.length > 0) {
			existingCommands.forEach(cmd => {
				console.log(` > FOUND: /${cmd.name} on ${guildId}`);
			});
		};
	} catch(error) {
		console.error('Error fetching installed commands: ', error);
	}
})();


// Grab all the command folders from the commands directory you created earlier
const commands = [];
const commandFiles = fs.readdirSync(`${__dirname}/commands`).filter(file => file.endsWith('.js'));
// const commandFiles = [`tribes.js`];

console.log('\nCompiling commands list...')
commandFiles.forEach(file => {
    const command = require(`./commands/${file}`);
    if ('data' in command && 'execute' in command) {
        console.log(` > FOUND: /${command.data.name}`)
        commands.push(command.data);
    } else {
        console.log(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
    }
})
console.log('Commands list compiled. Deploying commands...');


// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands }
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();

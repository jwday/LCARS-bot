const fs = require("fs");

module.exports = {
	name: 'reloadcmd',
	description: 'Reload all the commands (for debugging purposes).',
	async execute(message, client, args) {
		const commandsDir = `${__dirname}`;
		const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith(".js"));
		for (const file of commandFiles) {
			const command = require(`${commandsDir}/${file}`);

			// set a new item in the Collection
			// with the key as the command name and the value as the exported module
			client.commands.set(command.name, command);
		}
		console.log('Commands reloaded.')
		// return connection;  // Pass through
	},
};
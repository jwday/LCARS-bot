const Discord = require("discord.js");

module.exports = {
	name: 'help',
	description: 'List all available commands or get help for a specific set of commands.',
	syntax: '!help [Command1 Command2 ...]',
	arguments: {'Command': 'The specific command you want more info on.'},
	voiceReq: false,
	async execute(message, client, argsString) {
		const args = argsString.split(' ');

		if (args[0] === '') {
			const newEmbed = new Discord.MessageEmbed()
			client.commands.forEach(element => {
				// console.log(`${element.name}: ${element.description}`);
				newEmbed.addField(`!${element.name}`, `${element.description}`, false);
			});
			message.channel.send(newEmbed);

		} else {
			args.forEach(arg => {
				if (client.commands.has(arg)) {
					let cmd = client.commands.find(element => element.name === arg);
					
					const newEmbed = new Discord.MessageEmbed();
					newEmbed.setTitle(`${cmd.name}`);
					newEmbed.setDescription(`${cmd.description}`,false);
					newEmbed.addField('Syntax', `${cmd.syntax}`, false);

					if (cmd.arguments !== 'None') {
						argStr = '';
						for (const key in cmd.arguments) {
							const str = `${key}: ${cmd.arguments[key]}\n`;
							argStr = argStr.concat(str);
						}
					} else {
						argStr = 'None';
					}
					newEmbed.addField(`Optional arguments`, `${argStr}`, false);
					message.channel.send(newEmbed);
				}
			});
		}
	},
};
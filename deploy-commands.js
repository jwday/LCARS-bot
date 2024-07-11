// THERE IS A DAILY LIMIT ON COMMAND CREATIONS
const { REST, Routes } = require('discord.js');
const { token } = require(`${__dirname}/myconfig.json`)		// Store the token in "myconfig.json" which isn't tracked by Git
const fs = require('fs');

const commands = [];
const commandFiles = fs.readdirSync(`${__dirname}/commands`).filter(file => file.endsWith('.js'));

async function deployCommands(client, guilds) {
    try {
        // await rest.post(Routes.channelMessages('820583136928727041'), {
        //     body: {
        //         content: 'Connection via REST API successful! Deploying commands now...',
        //     },
        // });
        console.log('\nRefreshing application commands...');

        // Manage commands per-guild (make this global after you're done testing)
        for (const guild of guilds.values()) {
            // Fetch existing commands
            // const existingCommands = await rest.get(
            //     Routes.applicationGuildCommands(client.user.id, guild.id)
            // );

            // If it exists, delete it
            // if (existingCommands) {
            //     for (const cmd of existingCommands) {
            //         await rest.delete(
            //             Routes.applicationGuildCommand(client.user.id, guild.id, cmd.id)
            //         );
            //         console.log(` > DELETED: /${cmd.name} on ${guild.name}`);
            //     };
            // };

            // Compile all commands in commands folder
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
            console.log('Commands list compiled. Deploying commands...')

            // Construct and prepare an instance of the REST module
            const rest = new REST({ version: '10' }).setToken(token);

            // and deploy your commands!
            try {
        		// The put method is used to fully refresh all commands in the guild with the current set
                const data = await rest.put(
                    Routes.applicationGuildCommands(client.user.id, guild.id),
                    { body: commands }
                );
                return console.log(`\nSuccessfully deployed application (/) commands on ${guild.name}`);
            } catch (error) {
                console.error('Failed to deploy application (/) commands:', error)
                return error
            }
        };

    } catch (error) {
        console.error('Failed during command deployment:', error);
        return error;
    }
};

module.exports = { deployCommands };
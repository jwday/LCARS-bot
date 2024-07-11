const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const googleIt = require('google-it');

module.exports = {
    data: {
		name: 'google',
		type: 1,
		description: 'Make a google search through LCARS.',
		options: [
			{
				name: 'query',
				type: 3,
                description: 'Your search query',
				required: true,
			},
			{
				name: 'num',
				type: 4,
				description: 'Number of results you want to show (1-3)',
				required: false,	
			}
		],
		// cooldown: 10,
		// voiceReq: false,
    },
    execute(interaction) {
		searchQuery = interaction.options.data[0].value
		try {
			num = interaction.options.data[1].value;
		}
		catch {
			num = 1;
		}
		// interaction.reply(`Google "${searchQuery}" yourself you lazy fuck`);
		// if (argsString[0] === '') {
		// 	interaction.reply('You must supply a valid search query.');
		// 	return;
		// }

		// const args = argsString.split(' -');
		// const searchQuery = args[0];
		// if (args[0] === '') {
		// 	message.channel.send('You must supply a valid search query before including arguments.');
		// 	return;
		// }

		// var num = 1;
		// args.shift(); // Remove search query from arguments then parse remaining arguments as normal

		// if (args.length) {
		// 	args.forEach(arg => {
		// 		arg = Array.from(arg.trim().split(' ')); // Multi-input arguments are split into array elements for easy access
				
		// 		// Check the first element of the arg array to see what the argument is
		// 		if (arg[0] == 'n' || arg[0] == 'num') {
		// 			// Some arguments may have additional parameters which will be stored as further array elements
		// 			numCheck = parseFloat(arg[1]);
		// 			if (isNaN(numCheck)) {
		// 				message.channel.send('The number option requires a valid number to be supplied.');
		// 			} else if (numCheck < 1 || numCheck > 10) {
		// 				message.channel.send('The number option requires a value between 1 and 10.');
		// 			} else {
		// 				num = numCheck;
		// 			}
					
		// 		} else {
		// 			message.channel.send(`Argument -${arg[0]} is invalid.`);
		// 		}
		// 	});
			
		// } else {
		// 	// Default behavior
		// }

		googleIt({'limit': num, 'no-display': true, 'query': searchQuery}).then(async results => {
			console.log('Results: ' + results);
			const googleThumb = new AttachmentBuilder(`${__dirname}/../misc/google-icon-thumb-sm.png`);
			const colors = ['#4285f4', '#ea4335', '#fbbc05', '#34a853'];
			const allEmbeds = [];

			try {
				for (i=0; i < results.length; i++) {
					randIdx = Math.floor(Math.random() * colors.length)
					const randColor = colors[randIdx];
					colors.splice(randIdx, 1);	// Remove this color from the array so that it doesn't appear again
		
					const newEmbed = new EmbedBuilder()
						.setColor(randColor)
						.setTitle(results[i].title)
						.setThumbnail('attachment://google-icon-thumb-sm.png')
						.setURL(results[i].link)
						.setDescription(results[i].snippet,false)
						// .attachFiles([googleThumb])
						// .setImage('attachment://google-icon-thumb-sm.png')
						// .setAuthor(`Google-It`, 'attachment://google-icon-thumb-sm.png', 'https://www.npmjs.com/package/google-it')
						// .setAuthor({
						// 	name: results[i].title, 
						// 	iconURL: 'attachment://google-icon-thumb-sm.png', 
						// 	url: results[i].link
						// })
					allEmbeds.push(newEmbed)
			
				}
				// Send the embed as a reply to the interaction
				await interaction.reply({ embeds: allEmbeds, files: [googleThumb]});
			} catch(error) {
				console.error(error);
				await interaction.reply('Error executing command. No results found?');
				return;
			}

		}).catch(e => {
			console.log(e);
			// any possible errors that might have occurred (like no Internet connection)
		})
    },
};

// module.exports = {
// 	name: 'google',
// 	description: 'Make a google search through LCARS.',
// 	syntax: '!google {search phrase} [-n XX | -num XX]',
// 	arguments: {'n': 'Number of results to return (1-3). Default is 1.'},
// 	cooldown: 10,
// 	voiceReq: false,
// 	async execute(message, client, argsString) {
// 		if (argsString[0] === '') {
// 			message.channel.send('You must supply a valid search query.');
// 			return;
// 		}

// 		const args = argsString.split(' -');
// 		const searchQuery = args[0];
// 		if (args[0] === '') {
// 			message.channel.send('You must supply a valid search query before including arguments.');
// 			return;
// 		}

// 		var num = 1;
// 		args.shift(); // Remove search query from arguments then parse remaining arguments as normal

// 		if (args.length) {
// 			args.forEach(arg => {
// 				arg = Array.from(arg.trim().split(' ')); // Multi-input arguments are split into array elements for easy access
				
// 				// Check the first element of the arg array to see what the argument is
// 				if (arg[0] == 'n' || arg[0] == 'num') {
// 					// Some arguments may have additional parameters which will be stored as further array elements
// 					numCheck = parseFloat(arg[1]);
// 					if (isNaN(numCheck)) {
// 						message.channel.send('The number option requires a valid number to be supplied.');
// 					} else if (numCheck < 1 || numCheck > 10) {
// 						message.channel.send('The number option requires a value between 1 and 10.');
// 					} else {
// 						num = numCheck;
// 					}
					
// 				} else {
// 					message.channel.send(`Argument -${arg[0]} is invalid.`);
// 				}
// 			});
			
// 		} else {
// 			// Default behavior
// 		}

// 		googleIt({'limit': num, 'no-display': true, 'query': searchQuery}).then(results => {
// 			console.log('Results: ' + results);
// 			const googleThumb = `${__dirname}/../misc/google-icon-thumb-sm.png`;
// 			const colors = ['#4285f4', '#ea4335', '#fbbc05', '#34a853'];

// 			try {
// 				for (i=0; i < results.length; i++) {
// 					const randColor = colors[Math.floor(Math.random() * colors.length)];
		
// 					const newEmbed = new Discord.MessageEmbed()
// 						.attachFiles([googleThumb])
// 						.setColor(randColor)
// 						// .setThumbnail('attachment://google-icon-thumb-sm.png')
// 						.setAuthor(`Google-It`, 'attachment://google-icon-thumb-sm.png', 'https://www.npmjs.com/package/google-it')
// 						// .setAuthor(`${results[0].title}`, 'attachment://google-icon-thumb.png', `${results[0].link}`)
// 						.setTitle(`${results[i].title}`)
// 						.setURL(`${results[i].link}`)
// 						.setDescription(`${results[i].snippet}`,false)
		
// 					message.channel.send(newEmbed);
// 				}
// 			} catch(error) {
// 				console.error(error);
// 				message.reply('Error executing command. No results found?');
// 				return;
// 			}

// 		}).catch(e => {
// 			console.log(e);
// 			// any possible errors that might have occurred (like no Internet connection)
// 		})
// 	},
// };
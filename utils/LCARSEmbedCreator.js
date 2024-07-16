const { EmbedBuilder } = require('discord.js');

function LCARSEMbedCreator(interaction, ...args) {
	const colors = ['#ec0000', '#FFC300', '#008bec']
	const randColor = colors[Math.floor(Math.random() * colors.length)];
	const newEmbed = new EmbedBuilder()
			.setColor(randColor)
			.setAuthor({ name: args["author"], url: args["url"]})
			.setTitle(args["title"])
			.setURL(args["url"])
			.setDescription(args["description"])
			.setThumbnail(args["thumbnail"])
			.addFields(
				// { 
					// 	name: meta.author,
					// 	value: `[Watch on YouTube](${meta.url})`
					// 	// value: meta.author 
					// },
					{
						name: 'Requester',
						value: interaction.member.displayName,
						inline: true
					},
					{ 
						name: 'Volume', 
						value: `${args["vol"]}/10`,
						inline: true 
					},
					{ 
						name: 'Duration', 
						value: args["duration"],
						inline: true 
					},
				)
			// .addField('This was a risky play!', `${message.member.displayName} may have played something unexpected.`, false);
			// .setImage('https://i.imgur.com/wSTFkRM.png')
			// .setTimestamp()
			// .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');
            
    return newEmbed
}

module.exports = { LCARSEMbedCreator };
const { createReadStream } = require('node:fs');
const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType } = require('@discordjs/voice');
const { OpusEncoder } = require('@discordjs/opus');
const generateButton = require('../misc/LCARSbuttongenerator');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('soundboard')
        // type: 1,
        .setDescription('Make a sound board in the channel.')
		.addStringOption(option =>
			option.setName('volume')
                // type: 4,
                .setDescription('Volume (0-10)')
                .setRequired(false)),
        // syntax: '!soundboard [-v XX | -vol XX]',
        // arguments: {'-v': 'Volume (0-10)'},
        // cooldown: 5,
        // voiceReq: true,
	async execute(interaction) {
        // Check if the user is in a voice channel
		const  voiceChannel  = interaction.member.voice.channel;
		if (!voiceChannel) {
            return interaction.reply({ content: 'You need to be in a voice channel to use this command!', ephemeral: true });
		}

		// Join the voice channel
		const connection = joinVoiceChannel({
			channelId: voiceChannel.id,
			guildId: interaction.guild.id,
			adapterCreator: interaction.guild.voiceAdapterCreator,
			selfDeaf: false, // Bot joins deafened
			selfMute: false  // Bot joins muted
		});

		// Handle arguments
		const vol = interaction.options.getString('volume') ?? 5;

		// Create the "soundboard", which is going to be an embed object with emoji reacts applied to it.
		// LCARS will register a user emoji react, play the appropriate sound, then return it to a count of 1.
		// Ideally would prefer to use some sort of "set react count" rather than "remove one react" function.
		const colorsLCARS = ['#FFCC99', '#CC99CC', '#9999CC'];
        randIdx = Math.floor(Math.random() * colorsLCARS.length)
        const randColor = colorsLCARS[randIdx];

        // List of emojis to react with
        const buttonList = [
			{ title: 'Hail',	 		file: 'TNGhail.ogg', 		emoji: '📞'},
			{ title: 'Yardsale', 		file: 'yardsale.WAV', 		emoji: '🚩'}, 
            { title: 'YW',	 			file: 'vote_init.ogg', 		emoji: '🗳️'}, 
            { title: 'Vote Pass', 		file: 'vote_passes.ogg', 	emoji: '✅'}, 
            { title: 'Vote Fail', 		file: 'vote_fails.ogg', 	emoji: '❌'}, 
            { title: 'Tribes!', 		file: 'crue1.ogg', 			emoji: '🎸'}, 
            { title: 'Trieebs', 		file: 'crue2.ogg', 			emoji: '🥁'}, 
            { title: 'Heist', 			file: 'heist.ogg', 			emoji: '💰'}, 
            { title: 'I\'m Out', 		file: 'leaving.mp3', 		emoji: '📤'},  
            { title: 'Weed', 			file: 'smoke.mp3', 			emoji: '🚬'},  
            { title: 'John Cena', 		file: 'johncena.ogg', 		emoji: '💪'}, 
            { title: 'Boom', 			file: 'MA2.ogg', 			emoji: '💥'},  
        ];
		          
		// Create an LCARS-like image to display with the embed
		// Check if a soundboard message has already been created in the past (based on msgID)
		// messageID = interaction.id;
		// if(soundboardID) {
		// 	interaction.client.guilds.get('guildID')
		// 		.channels.get('channelID')
		// 		.fetchMessage(soundboardID)
		// 		.then(message => message.delete());
		// } else {
		// 	var soundboardID = messageID
		// }
		const image = await generateButton(messageID);
        const LCARSimage = new AttachmentBuilder(image, { name: 'LCARS_button.png' });        
		const soundboardEmbed = new EmbedBuilder()
			.setColor(randColor)
			.setTitle(`LCARS SOUNDBOARD ${messageID.slice(-4)}`)
			.setThumbnail('attachment://LCARS_button.png')
			.setDescription(`React with one of the emoji to play a pre-programmed sound. Note there's about a 1/2-second delay.\n**Volume:** ${vol}/10`)
			// .attachFiles([LCARSimage])
			// .attachFiles([spiffThumb])
			// .setAuthor('A Discord Sound Board', 'attachment://LCARS_button.png')
			// .setImage('attachment://LCARS_button.png')
			// .setURL(song.url)
		
        // Create buttons for different actions			
		let rowComponents = []
		let singleRow = new ActionRowBuilder() 
		let allRows = []

		buttonList.forEach(({ title, emoji }) => {
			soundboardEmbed.addFields({
				name: title,
				value: emoji,
				inline: true
			})

			const newButton = new ButtonBuilder()
				.setCustomId(title)
				// .setLabel('Foo')
				.setEmoji(emoji)
				.setStyle(ButtonStyle.Secondary)
			if (rowComponents.length  < 5) {
				rowComponents.push(newButton)
			} else {
				singleRow.addComponents(rowComponents);
				allRows.push(singleRow)
				
				singleRow = new ActionRowBuilder()
				rowComponents = []
				rowComponents.push(newButton)
			}
		});
		singleRow.addComponents(rowComponents); // Add last single row
		allRows.push(singleRow)

        // Send the embed as a reply to the interaction
        replyMessage = await interaction.reply({ 
			embeds: [soundboardEmbed], 
			components: allRows, 
			files: [LCARSimage]
		});



		// Handle button interactions
		const collector = replyMessage.createMessageComponentCollector({ componentType: ComponentType.Button });

        collector.on('collect', async i => {
			const reaction = buttonList.filter(d => d.title === i.customId)
			// If reaction.length == 1 {}
			const filename = reaction[0].file

			// Create an audio resource
			const soundsDir = `${__dirname}/../sounds/`;
			const resource = createAudioResource(soundsDir + filename, {
				inlineVolume: true
			});
			resource.volume.setVolume(vol / 10);
			
			// Create an audio player
			const player = createAudioPlayer();

			// Play the audio resource
			connection.subscribe(player);
			player.play(resource);

			// Reply to the button-pusher because it requires you to, then delete
			await i.deferReply()
			await i.deleteReply()
        });
	},
};
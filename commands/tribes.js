const { SlashCommandBuilder } = require('discord.js');
const youtubedl = require('youtube-dl-exec')
const fs = require('fs');
 
module.exports = {
	data: new SlashCommandBuilder()
		.setName('tribes')
		.setDescription('DL tribes'),

	async execute(interaction) {
		await youtubedl('https://www.youtube.com/watch?v=L-uHSx-YrSA', {
            extractAudio: true,
            audioQuality: 10,
        })
        .then(output => console.log(output))

		// await ytdl('https://www.youtube.com/watch?v=L-uHSx-YrSA', { filter: 'audioonly', quality: 'lowestaudio' })
		// 	.pipe(fs.createWriteStream(`${__dirname}/tribes.mp4`));

	},
};
module.exports = {
    data: {
        name: 'ping',
        description: 'Replies with Pong!',
    },
    execute(interaction) {
        interaction.reply('Pong!');
    },
};
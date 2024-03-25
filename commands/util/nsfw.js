const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('nsfw').setDescription('NSFW stuff. Require age 18+'),
    async execute(interaction) {
        await interaction.reply(`NSFW message`);
    },
};

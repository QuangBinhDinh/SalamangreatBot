const { SlashCommandBuilder } = require('discord.js');
const { calcBuy, calcSell, generateProfitMessage } = require('../../calc/profit.js');

const city_name = '曼德矿场';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mander_mine')
        .setDescription('Calculate profit from selling Mander Mine stuff'),
    async execute(interaction) {
        let msg = '';
        try {
            const res = await fetch('https://resonance.breadio.wiki/api/product');
            const data = (await res.json()).latest;

            msg = generateProfitMessage(data, city_name);
        } catch (e) {
            console.log(e);
            msg = 'Oops! Error happened';
        }

        await interaction.reply(msg);
    },
};

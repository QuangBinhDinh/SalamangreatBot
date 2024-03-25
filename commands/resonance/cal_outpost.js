const { SlashCommandBuilder } = require('discord.js');
const { calcBuy, calcSell, generateProfitMessage } = require('../../calc/profit.js');

const city_name = '铁盟哨站';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('outpost')
        .setDescription('Calculate profit from selling Iron Alliance Outpost stuff'),
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

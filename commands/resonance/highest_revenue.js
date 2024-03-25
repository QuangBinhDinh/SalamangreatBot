const { SlashCommandBuilder } = require('discord.js');
const { calcProfit } = require('../../calc/profit.js');
const { maxBy } = require('lodash');

const cities = require('../../data/city.js');

const STORAGE = 505;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('highest_revenue')
        .setDescription('Calculate highest revenue selling stuff from all cities'),
    async execute(interaction) {
        let msg = '';
        try {
            const res = await fetch('https://resonance.breadio.wiki/api/product');
            const data = (await res.json()).latest;

            msg = msg + 'Compare highest revenue of all cities: \n\n';
            for (const [key, value] of cities) {
                msg = msg + value.name + '\n';
                const { volume, profitTable, buy_amount } = calcProfit(data, key);
                const target = maxBy(profitTable, i => i.profit);

                msg = msg + `Total purchased: ${volume}\n`;
                // msg = msg + `Buy amount:  ${buy_amount}\n`;
                msg = msg + `Highest profit (1 ticket)  to ${target.city} with profit of ${target.profit}\n`;

                msg = msg + `Number of ticket used in 1 trip:  ${Math.ceil(STORAGE / volume) - 1}\n`;
                msg = msg + `Highest revenue in one trip:  ${Math.floor((STORAGE / volume) * target.profit)}\n`;
                msg = msg + `Product on store left:  ${Math.ceil(STORAGE / volume) * volume - STORAGE}\n`;
                msg = msg + '\n';
            }
        } catch (e) {
            console.log(e);
            msg = 'Oops! Error happened';
        }

        await interaction.reply(msg);
    },
};

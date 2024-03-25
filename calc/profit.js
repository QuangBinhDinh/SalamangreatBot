const products = require('../data/product.js');
const cities = require('../data/city.js');
const prod_bonus = require('../data/product_bonus.js');

const calcBuy = (data, city_name) => {
    const buy_list = data.filter(i => i.sourceCity == city_name && i.targetCity == city_name && i.type == 'buy');
    console.log('\nBuy list :');
    console.log(buy_list);

    const source_city = cities.get(city_name);

    const volume_multi = source_city.level / 10 + 1;
    const tax_percent = source_city.init_tax - Math.floor(source_city.level / 2) * 0.5;

    const total_buy =
        buy_list.reduce((prev, next) => {
            var multi = volume_multi + (prod_bonus.get(next.name) || 0);
            return prev + next.price * Math.round(next.volume * multi);
        }, 0) *
        0.8 *
        (1 + tax_percent / 100);

    const total_volume = buy_list.reduce((prev, next) => {
        var multi = volume_multi + (prod_bonus.get(next.name) || 0);
        return prev + Math.round(next.volume * multi);
    }, 0);

    return {
        buy: Math.round(total_buy),
        volume: total_volume,
    };
};

const calcSell = (data, source, target) => {
    const sell_list = data.filter(i => i.sourceCity == source && i.targetCity == target && i.type == 'sell');
    // console.log('\nSell list :');
    // console.log(sell_list);

    const target_city = cities.get(target);

    const volume_multi = target_city.level / 10 + 1;
    const tax_percent = target_city.init_tax - Math.floor(target_city.level / 2) * 0.5;

    const total_sell =
        sell_list.reduce((prev, next) => {
            var multi = volume_multi + (prod_bonus.get(next.sourceCity) || 0);
            return prev + next.price * Math.round(next.volume * multi);
        }, 0) *
        1.2 *
        (1 - tax_percent / 100);

    return Math.round(total_sell);
};

const calcProfit = (data, city_name) => {
    const newData = data.map(i => ({ ...i, volume: products.get(i.name) || 0 }));
    const target_city = [...cities.keys()].filter(name => name !== city_name);

    var profitTable = [];

    const { buy, volume } = calcBuy(newData, city_name);

    for (const target of target_city) {
        var sell = calcSell(newData, city_name, target);
        profitTable.push({
            city: cities.get(target).name,
            profit: Math.round(sell - buy),
            sell_amount: Math.round(sell),
        });
    }
    return {
        volume,
        profitTable,
        buy_amount: buy,
    };
};

const generateProfitMessage = (data, city_name) => {
    const { volume, profitTable } = calcProfit(data, city_name);
    let msg = '';
    msg = msg + `Total purchased: ${volume}\n\n`;
    msg = msg + `Profit table:\n\n`;
    for (const city of profitTable) {
        msg = msg + `${city.city} -------------- ${city.profit}\n`;
    }
    return msg;
};

module.exports = {
    calcBuy,
    calcSell,
    calcProfit,
    generateProfitMessage,
};

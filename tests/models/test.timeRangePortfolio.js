const _ = require('underscore');
const dateAndTime = require('date-and-time');
const portfolio = require('../../src/models/portfolio');
const purchaseInfo = require('../../src/models/purchaseInfo');
const purchasePriceInfo = require('../../src/models/purchasePriceInfo');
const timeRangePortfolio = require('../../src/models/timeRangePortfolio');

describe.skip('timeRangePortfolio', () => {
    it('test getStats', () => {
        const endDate = new Date();
        const startDate = dateAndTime.addDays(endDate, -1);
        //const startDate = dateAndTime.parse('2018-02-11', 'YYYY-MM-DD');
        const portfolio1 = portfolio()
            .addPurchase(purchaseInfo('VFIAX').add(
                // Primer
                purchasePriceInfo({
                    boughtDate: '2018-03-05',
                    price: 0,
                    soldDate: null,
                    quantity: 543.257,
                })
            ).add(
                purchasePriceInfo({
                    boughtDate: '2018-03-05',
                    price: 252.04,
                    soldDate: null,
                    quantity: 15.87,
                })
            ).add(
                purchasePriceInfo({
                    boughtDate: '2018-05-02',
                    price: 243.59,
                    soldDate: null,
                    quantity: 8.2110,
                })
            ).add(
                purchasePriceInfo({
                    boughtDate: '2018-06-05',
                    price: 254.50,
                    soldDate: null,
                    quantity: 7.859,
                })
            )).addPurchase(purchaseInfo('VWILX').add(
                purchasePriceInfo({
                    boughtDate: '2018-04-02',
                    price: 0,
                    soldDate: null,
                    quantity: 514.697,
                })
            ).add(
                purchasePriceInfo({
                    boughtDate: '2018-04-02',
                    price: 96.89,
                    soldDate: null,
                    quantity: 20.642,
                })
            ).add(
                purchasePriceInfo({
                    boughtDate: '2018-06-05',
                    price: 101.72,
                    soldDate: null,
                    quantity: 19.662,
                })
            ).add(
                purchasePriceInfo({
                    boughtDate: '2018-07-03',
                    price: 99.03,
                    soldDate: null,
                    quantity: 20.1960,
                })
            )).addPurchase(purchaseInfo('Z').add(
                purchasePriceInfo({
                    boughtDate: '2018-06-01',
                    price: 0,
                    soldDate: null,
                    quantity: 121,
                })
            )).addPurchase(purchaseInfo('VIRSX').add(
                purchasePriceInfo({
                    boughtDate: '2018-06-27',
                    price: 0,
                    soldDate: null,
                    quantity: 5115.998,
                })
            )).addPurchase(purchaseInfo('OTCFX').add(
                purchasePriceInfo({
                    boughtDate: '2018-04-02',
                    price: 47.45,
                    soldDate: null,
                    quantity: 84.299,
                })
            ).add(
                purchasePriceInfo({
                    boughtDate: '2018-05-02',
                    price: 48.81,
                    soldDate: null,
                    quantity: 81.95,
                })
            ).add(
                purchasePriceInfo({
                    boughtDate: '2018-06-04',
                    price: 51.76,
                    soldDate: null,
                    quantity: 38.60,
                })
            ).add(
                purchasePriceInfo({
                    boughtDate: '2018-07-02',
                    price: 52.19,
                    soldDate: null,
                    quantity: 38.322,
                })
            ).add(
                purchasePriceInfo({
                    boughtDate: '2018-04-02',
                    price: 47.45,
                    soldDate: null,
                    quantity: 804.612,
                })
            ));
        const trp = timeRangePortfolio(portfolio1, startDate, endDate);

        const statsPromises = trp.getStats();
        const promises = _.values(statsPromises);
        _.mapObject(statsPromises, (stats, ticker) => {
            stats.then(response => {
                console.log(ticker, " : ", response);
                return response;
            });
        });
        Promise.all(promises).then((responses) => {
            console.log("Stats Combined", trp.getStatsCombined(responses));
        });
    });
});

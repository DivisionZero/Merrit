const _ = require('underscore');
const dateAndTime = require('date-and-time');
const portfolio = require('../../src/models/portfolio');
const purchaseInfo = require('../../src/models/purchaseInfo');
const purchasePriceInfo = require('../../src/models/purchasePriceInfo');
const timeRangePortfolio = require('../../src/models/timeRangePortfolio');

describe('timeRangePortfolio', () => {
    it.only('test getStats', () => {
        const endDate = new Date();
        //const startDate = dateAndTime.addDays(endDate, -1);
        const startDate = dateAndTime.parse('2018-02-11', 'YYYY-MM-DD');
        const portfolio1 = portfolio()
            .addPurchase(purchaseInfo('Z').add(
                purchasePriceInfo({
                    boughtDate: '2015-01-03',
                    price: 32.32,
                    soldDate: null,
                    quantity: 3000,
                })
            ).add(
                purchasePriceInfo({
                    boughtDate: '2017-01-03',
                    price: 25.32,
                    soldDate: null,
                    quantity: 5000,
                })
            ).add(
                purchasePriceInfo({
                    boughtDate: '2015-08-13',
                    price: 30.43,
                    soldDate: '2016-02-13',
                    quantity: 1000,
                })
            )).addPurchase(purchaseInfo('MSFT').add(
                purchasePriceInfo({
                    boughtDate: '2000-01-03',
                    price: 50.32,
                    soldDate: '2014-04-19',
                    quantity: 1000,
                })
            )).addPurchase(purchaseInfo('GE').add(
                purchasePriceInfo({
                    boughtDate: '2000-01-03',
                    price: 10.32,
                    soldDate: null,
                    quantity: 300,
                })
            ).add(
                purchasePriceInfo({
                    boughtDate: '2018-01-03',
                    price: 8.32,
                    soldDate: null,
                    quantity: 400,
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

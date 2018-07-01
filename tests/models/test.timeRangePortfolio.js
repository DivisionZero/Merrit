const dateAndTime = require('date-and-time');
const portfolio = require('../../src/models/portfolio');
const purchaseInfo = require('../../src/models/purchaseInfo');
const purchasePriceInfo = require('../../src/models/purchasePriceInfo');
const timeRangePortfolio = require('../../src/models/timeRangePortfolio');

describe('timeRangePortfolio', () => {
    it('test getStats', () => {
        /*
         another promise then:  { price: 13.61, date: 2018-06-29T17:30:46.062Z } { price: 13.61, date: 2018-06-29T17:30:46.062Z }
another promise then:  { price: 13.61, date: 2018-06-29T17:30:46.062Z } { price: 13.61, date: 2018-06-29T17:30:46.062Z }
another promise then:  { price: 59.06, date: 2018-06-29T17:30:46.062Z } { price: 59.06, date: 2018-06-29T17:30:46.062Z }
another promise then:  { price: 59.06, date: 2018-06-29T17:30:46.062Z } { price: 59.06, date: 2018-06-29T17:30:46.062Z }
*/
        const endDate = new Date();
        const startDate = dateAndTime.addDays(endDate, -1);
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
        console.log(trp.getStats());
    });
});

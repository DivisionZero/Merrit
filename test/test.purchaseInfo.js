const assert = require('assert');
const purchaseInfo = require('../src/models/purchaseInfo');
const purchasePriceInfo = require('../src/models/purchasePriceInfo');

describe('tickerInfo', () => {
    // TODO: change these
    it('verify this works', () => {
        const priceA = 50;
        const priceB = 40;
        const quantityA = 10;
        const quantityB = 30;
        const purchaseInfoObj = purchaseInfo('MSFT');
        purchaseInfoObj.add(purchasePriceInfo({
            price: priceA,
            date: new Date(),
            quantity: quantityA,
        })).add(purchasePriceInfo({
            price: priceB,
            date: new Date(),
            quantity: quantityB,
        }));

        assert.equal(purchaseInfoObj.total(), (priceA * quantityA) + (priceB * quantityB));
    });
});

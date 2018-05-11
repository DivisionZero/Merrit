const assert = require('assert'),
      purchaseInfo = require('../src/models/purchaseInfo'),
      purchasePriceInfo = require('../src/models/purchasePriceInfo');

describe('tickerInfo', () => {
    // TODO: change these
    it('verify this works', () => {
        const priceA = 50,
              priceB = 40,
              quantityA = 10,
              quantityB = 30;
        let purchaseInfoObj = purchaseInfo('MSFT');
        purchaseInfoObj.add(purchasePriceInfo({
            price: priceA,
            date: new Date(),
            quantity: quantityA
        }));
        purchaseInfoObj.add(purchasePriceInfo({
            price: priceB,
            date: new Date(),
            quantity: quantityB
        }));

        assert.equal(purchaseInfoObj.total(), (priceA * quantityA) + (priceB * quantityB));
    });
});

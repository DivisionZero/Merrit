const chai = require('chai');
const purchaseInfo = require('../../src/models/purchaseInfo');
const purchasePriceInfo = require('../../src/models/purchasePriceInfo');
chai.should();

describe('purchaseInfo', () => {
    it('test total()', () => {
        const priceA = 50;
        const priceB = 40;
        const quantityA = 10;
        const quantityB = 30;
        const purchaseInfoObj = purchaseInfo('MSFT');
        purchaseInfoObj.add(purchasePriceInfo({
            price: priceA,
            boughtDate: new Date(),
            quantity: quantityA,
        })).add(purchasePriceInfo({
            price: priceB,
            boughtDate: new Date(),
            quantity: quantityB,
        }));

        purchaseInfoObj.total().should.equal((priceA * quantityA) + (priceB * quantityB));
    });
});

const chai = require('chai');
const portfolio = require('../../src/models/portfolio');
const purchaseInfo = require('../../src/models/purchaseInfo');
const purchasePriceInfo = require('../../src/models/purchasePriceInfo');

chai.should();

describe('portfolio', () => {
    it('test total()', () => {
        const now = new Date();
        const priceA1 = 35.23;
        const priceA2 = 31.05;
        const priceB1 = 5.00;
        const quantityA1 = 1000;
        const quantityA2 = 500;
        const quantityB1 = 13;
        const pA1 = purchasePriceInfo({
            price: priceA1,
            quantity: quantityA1,
            boughtDate: now,
        });
        const pA2 = purchasePriceInfo({
            price: priceA2,
            quantity: quantityA2,
            boughtDate: now,
        });
        const pB1 = purchasePriceInfo({
            price: priceB1,
            quantity: quantityB1,
            boughtDate: now,
        });
        const purchaseA1 = purchaseInfo('A').add(pA1);
        const purchaseA2 = purchaseInfo('A').add(pA2);
        const purchaseB1 = purchaseInfo('B').add(pB1);

        const portfolio1 = portfolio();
        portfolio1.addPurchase(purchaseA1)
            .addPurchase(purchaseA2)
            .addPurchase(purchaseB1);
        const total = (priceA1 * quantityA1) + (priceA2 * quantityA2) +
            (priceB1 * quantityB1);

        portfolio1.total().should.equal(total);
        portfolio1.total('B').should.equal(priceB1 * quantityB1);
    });
});

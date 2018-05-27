const chai = require('chai');
const purchasePriceInfo = require('../../src/models/purchasePriceInfo');

chai.should();

describe('purchasePriceInfo', () => {
    it('test total', () => {
        const price = 30.34;
        const boughtDate = new Date();
        const quantity = 432;
        const ppInfo = purchasePriceInfo({
            price,
            boughtDate,
            soldDate: null,
            quantity,
        });

        ppInfo.total.should.deep.equal(price * quantity);
    });
});

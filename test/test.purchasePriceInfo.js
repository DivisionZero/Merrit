const assert = require('assert');
const purchasePriceInfo = require('../src/models/purchasePriceInfo');

describe('purchasePriceInfo', () => {
    // TODO: change these
    it('verify this works!', () => {
        const price = 30.34;
        const date = new Date();
        const quantity = 432;
        const ppInfo = purchasePriceInfo({
            price,
            date,
            quantity,
        });

        assert.equal(ppInfo.total, price * quantity);
    });
});

const assert = require('assert'),
      purchasePriceInfo = require('../src/models/purchasePriceInfo');

describe('purchasePriceInfo', () => {
    // TODO: change these
    it('verify this works!', () => {
        const price = 30.34,
              date = new Date(),
              quantity = 432,
              ppInfo = purchasePriceInfo({
                price,
                date,
                quantity
              });
        
        assert.equal(ppInfo.total, price * quantity);
    });
});

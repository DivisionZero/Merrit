const assert = require('assert'),
      tickerPriceInfo = require('../models/tickerPriceInfo'),
      date = require('date-and-time');

describe('tickerPriceInfo', () => {
    // TODO: make this better and learn Mocha, should, chai etc
    it('verify all values are numbers', () => {
        const tpi = tickerPriceInfo('2018-01-03', {
            open: 10.00,
            high: 11.00,
            low: 9.13,
            close: 10.45,
            volume: 1000343,
        });
        assert.equal(tpi.high, 11.00);
        assert.equal(date.format(tpi.date, 'YYYY-MM-DD'), '2018-01-03');
    });
});

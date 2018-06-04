const chai = require('chai');
const tickerPriceInfo = require('../../src/models/tickerPriceInfo');
const date = require('date-and-time');
const { DAY_FORMAT } = require('../../src/utils/dateTools');

chai.should();

describe('tickerPriceInfo', () => {
    it('verify all values are valid', () => {
        const close = 10.45;
        const dateStr = '2018-01-03';
        const tpi = tickerPriceInfo(dateStr, {
            "1. open": 10.00,
            "2. high": 11.00,
            "3. low": 9.13,
            "4. close": close,
            "5. volume": 1000343,
        });
        tpi.close.should.deep.equal(close);
        date.format(tpi.date, DAY_FORMAT).should.equal(dateStr);
    });
});

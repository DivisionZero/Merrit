const chai = require('chai');
const tickerPriceInfo = require('../../src/models/tickerPriceInfo');
const date = require('date-and-time');
const { DAY_FORMAT } = require('../../src/utils/dateTools');
const { constants } = require('../../src/services/alphaVantageService');

chai.should();

describe('tickerPriceInfo', () => {
    it('verify all values are valid', () => {
        const close = 10.45;
        const dateStr = '2018-01-03';
        const tpiObj = {};
        tpiObj[constants.OPEN] = 10.00;
        tpiObj[constants.HIGH] = 11.00;
        tpiObj[constants.LOW] = 9.13;
        tpiObj[constants.CLOSE] = close;
        tpiObj[constants.VOLUME] = 1000343;
        const tpi = tickerPriceInfo(dateStr, tpiObj);
        tpi.close.should.deep.equal(close);
        date.format(tpi.date, DAY_FORMAT).should.equal(dateStr);
    });
});

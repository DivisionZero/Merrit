const chai = require('chai');
const tickerSvc = require('../../src/services/tickerService');
const tickerInfo = require('../../src/models/tickerInfo');
const dateAndTime = require('date-and-time');
const dateTool = require('../../src/utils/dateTools');

chai.should();

describe('tickerService', () => {
    let tickerService;
    const timeSeriesDailyStr = 'Time Series (Daily)';
    const now = new Date();
    const price = 100;
    beforeEach(() => {
        tickerService = tickerSvc({
            timeSeriesDaily(ticker) {
                const timeSeriesData = {};
                timeSeriesData[timeSeriesDailyStr] = {};
                timeSeriesData[timeSeriesDailyStr][dateAndTime.format(now, dateTool.DAY_FORMAT)] = {
                    close: price,
                };
                const tickerObj = tickerInfo({ interval: 'Daily' }, timeSeriesData);
                return tickerObj;
            },
        });
    });
    it('test getPriceForDate()', () => {
        const priceObj = tickerService.getPriceForDate('Z', now);
        priceObj.price.should.deep.equal(price);
        dateTool.isSameDay(now, priceObj.date).should.be.true;
    });
});

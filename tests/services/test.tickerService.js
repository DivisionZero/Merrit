const chai = require('chai');
const tickerSvc = require('../../src/services/tickerService');
const tickerInfo = require('../../src/models/tickerInfo');
const dateAndTime = require('date-and-time');
const dateTool = require('../../src/utils/dateTools');
const _ = require('underscore');
const sinon = require('sinon');

chai.should();

describe('tickerService', () => {
    let tickerService;
    let timeSeriesDaily;
    const timeSeriesDailyStr = 'Time Series (Daily)';
    const now = new Date();
    const price = 100;
    beforeEach(() => {
        timeSeriesDaily = {
            timeSeriesDaily() {
                const timeSeriesData = {};
                timeSeriesData[timeSeriesDailyStr] = {};
                timeSeriesData[timeSeriesDailyStr][dateAndTime.format(now, dateTool.DAY_FORMAT)] = {
                    close: price,
                };
                const tickerObj = tickerInfo({ interval: 'Daily' }, timeSeriesData);
                return tickerObj;
            },
        };
        tickerService = tickerSvc(timeSeriesDaily);
        sinon.spy(timeSeriesDaily, 'timeSeriesDaily');
    });
    it('test getPriceForDate()', () => {
        const priceObj = tickerService.getPriceForDate('Z', now);
        priceObj.price.should.deep.equal(price);
        dateTool.isSameDay(now, priceObj.date).should.be.true;
        timeSeriesDaily.timeSeriesDaily.calledOnce.should.be.true;
    });
    it('test getPriceForDates()', () => {
        const priceObjs = tickerService.getPriceForDates('Z', [now]);
        priceObjs.length.should.equal(1);
        _.each(priceObjs, (priceObj) => {
            priceObj.price.should.deep.equal(price);
            dateTool.isSameDay(now, priceObj.date).should.be.true;
        });
        timeSeriesDaily.timeSeriesDaily.calledOnce.should.be.true;
    });
    it('test caching', () => {
        tickerService.setUseCache(true);
        tickerService.getPriceForDate('Z', now);
        timeSeriesDaily.timeSeriesDaily.calledOnce.should.be.true;
        tickerService.getPriceForDate('Z', now);
        timeSeriesDaily.timeSeriesDaily.calledOnce.should.be.true;

        tickerService.setUseCache(false);
        tickerService.getPriceForDate('Z', now);
        timeSeriesDaily.timeSeriesDaily.calledTwice.should.be.true;
    });
});

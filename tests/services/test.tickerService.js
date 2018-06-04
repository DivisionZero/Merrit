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
                    "4. close": price,
                };
                return Promise.resolve(JSON.stringify(timeSeriesData));
            },
        };
        tickerService = tickerSvc(timeSeriesDaily);
        sinon.spy(timeSeriesDaily, 'timeSeriesDaily');
    });
    it('test getPriceForDate()', (done) => {
        const priceObjPromise = tickerService.getPriceForDate('Z', now);
        priceObjPromise.then((response) => {
            response.price.should.deep.equal(price);
            dateTool.isSameDay(now, response.date).should.be.true;
            timeSeriesDaily.timeSeriesDaily.calledOnce.should.be.true;
            done();
        }).catch((err) => {
            console.log(err);
        });
    });
    it('test getPriceForDates()', (done) => {
        const priceObjPromises = tickerService.getPriceForDates('Z', [now]);
        priceObjPromises.length.should.equal(1);
        _.each(priceObjPromises, (promise) => {
            promise.then((response) => {
                response.price.should.deep.equal(price);
                dateTool.isSameDay(now, response.date).should.be.true;
            }).catch((err) => {
                console.log(err);
            });
        });
        timeSeriesDaily.timeSeriesDaily.calledOnce.should.be.true;
        done();
    });
    it('test caching', (done) => {
        tickerService.setUseCache(true);
        const priceObjPromise = tickerService.getPriceForDate('Z', now);
        priceObjPromise.then(() => {
            timeSeriesDaily.timeSeriesDaily.calledOnce.should.be.true;
            const anotherPromise = tickerService.getPriceForDate('Z', now);
            anotherPromise.then(() => {
                timeSeriesDaily.timeSeriesDaily.calledOnce.should.be.true;
                tickerService.setUseCache(false);
                const yetAnotherPromise = tickerService.getPriceForDate('Z', now);
                yetAnotherPromise.then(() => {
                    timeSeriesDaily.timeSeriesDaily.calledTwice.should.be.true;
                    done();
                });
            });
        }).catch((err) => {
            console.log(err);
        });
    });
});

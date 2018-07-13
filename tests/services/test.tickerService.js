const chai = require('chai');
const tickerSvc = require('../../src/services/tickerService');
const dateAndTime = require('date-and-time');
const dateTools = require('../../src/utils/dateTools');
const _ = require('underscore');
const sinon = require('sinon');

const { expect } = chai;

chai.should();

describe('tickerService', () => {
    const timeSeriesDailyStr = 'Time Series (Daily)';
    let tickerService;
    describe('Exact, no scaling', () => {
        let timeSeriesDaily;
        let dbTimeSeriesDaily;
        const now = new Date();
        const price = 100;
        beforeEach(() => {
            timeSeriesDaily = {
                timeSeriesDaily() {
                    const timeSeriesData = {};
                    const nowFormatted = dateAndTime.format(now, dateTools.DAY_FORMAT);
                    timeSeriesData[timeSeriesDailyStr] = {};
                    timeSeriesData[timeSeriesDailyStr][nowFormatted] = { '4. close': price };
                    return Promise.resolve(JSON.stringify(timeSeriesData));
                },
            };
            dbTimeSeriesDaily = {
                timeSeriesDaily() {
                    return Promise.resolve(null);
                },
                saveTimeSeriesDaily() {},
            };
            tickerService = tickerSvc(timeSeriesDaily, dbTimeSeriesDaily);
            sinon.spy(timeSeriesDaily, 'timeSeriesDaily');
            sinon.spy(dbTimeSeriesDaily, 'timeSeriesDaily');
        });
        it('test getPriceForDate()', (done) => {
            const priceObjPromise = tickerService.getPriceForDate('Z', now);
            priceObjPromise.then((response) => {
                response.price.should.deep.equal(price);
                dateTools.isSameDay(now, response.date).should.be.true;
                timeSeriesDaily.timeSeriesDaily.calledOnce.should.be.true;
                done();
            }).catch(() => {
            });
        });
        it('test getPriceForDates()', (done) => {
            const priceObjPromises = tickerService.getPriceForDates('Z', [now]);
            priceObjPromises.length.should.equal(1);
            _.each(priceObjPromises, (promise) => {
                promise.then((response) => {
                    response.price.should.deep.equal(price);
                    dateTools.isSameDay(now, response.date).should.be.true;
                    dbTimeSeriesDaily.timeSeriesDaily.calledOnce.should.be.true;
                    timeSeriesDaily.timeSeriesDaily.calledOnce.should.be.true;
                    done();
                }).catch(() => {
                });
            });
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
            }).catch(() => {
            });
        });
        it('test double fetching cached', (done) => {
            tickerService.setUseCache(true);
            const priceObjPromise1 = tickerService.getPriceForDate('Z', now);
            const priceObjPromise2 = tickerService.getPriceForDate('Z', now);
            Promise.all([priceObjPromise1, priceObjPromise2]).then(() => {
                timeSeriesDaily.timeSeriesDaily.calledOnce.should.be.true;
                done();
            });
        });
        it('test double fetching not cached', (done) => {
            tickerService.setUseCache(false);
            const priceObjPromise1 = tickerService.getPriceForDate('Z', now);
            const priceObjPromise2 = tickerService.getPriceForDate('Z', now);
            priceObjPromise1.then(() => {
                timeSeriesDaily.timeSeriesDaily.calledOnce.should.be.true;
            });
            priceObjPromise2.then(() => {
                timeSeriesDaily.timeSeriesDaily.calledOnce.should.be.true;
            });
            Promise.all([priceObjPromise1, priceObjPromise2]).then(() => {
                done();
            });
        });
    });
    describe('Find price with scaling', () => {
        let timeSeriesDaily;
        beforeEach(() => {
            timeSeriesDaily = {
                timeSeriesDaily() {
                    const timeSeriesData = {};
                    timeSeriesData[timeSeriesDailyStr] = {};
                    timeSeriesData[timeSeriesDailyStr]['2018-06-15'] = {
                        '4. close': 100,
                    };
                    timeSeriesData[timeSeriesDailyStr]['2018-06-14'] = {
                        '4. close': 90,
                    };
                    timeSeriesData[timeSeriesDailyStr]['2018-06-13'] = {
                        '4. close': 80,
                    };
                    timeSeriesData[timeSeriesDailyStr]['2018-06-12'] = {
                        '4. close': 70,
                    };
                    timeSeriesData[timeSeriesDailyStr]['2018-06-08'] = {
                        '4. close': 60,
                    };
                    timeSeriesData[timeSeriesDailyStr]['2018-06-07'] = {
                        '4. close': 50,
                    };
                    return Promise.resolve(JSON.stringify(timeSeriesData));
                },
            };
            dbTimeSeriesDaily = {
                timeSeriesDaily() {
                    return Promise.resolve(null);
                },
                saveTimeSeriesDaily() {},
            };
            tickerService = tickerSvc(timeSeriesDaily, dbTimeSeriesDaily);
            sinon.spy(timeSeriesDaily, 'timeSeriesDaily');
        });
        it('test getPriceForDateScaling Found', (done) => {
            const pricePromise = tickerService.getPriceForDateScaling('Z', dateAndTime.parse('2018-06-15', dateTools.DAY_FORMAT));
            pricePromise.then((response) => {
                response.price.should.deep.equal(100);
                done();
            });
        });
        it('test getTicketMinDate', (done) => {
            const datePromise = tickerService.getTickerMinDate('Z');
            datePromise.then((response) => {
                response.close.should.deep.equal(50);
                dateTools.isSameDay(response.date, dateAndTime.parse('2018-06-07', dateTools.DAY_FORMAT)).should.be.true;
                done();
            });
        });
        it('test getPriceForDateScaling Not Found, Scaled Down', (done) => {
            const pricePromise = tickerService.getPriceForDateScaling('Z', dateAndTime.parse('2018-06-16', dateTools.DAY_FORMAT));
            pricePromise.then((response) => {
                response.price.should.deep.equal(100);
                dateTools.isSameDay(response.date, dateAndTime.parse('2018-06-15', dateTools.DAY_FORMAT)).should.be.true;
                done();
            });
        });
        it('test getPriceForDateScaling picking date earlier than api output has', (done) => {
            expect(() => tickerService.getPriceForDateScaling('Z', dateAndTime.parse('2018-06-07', dateTools.DAY_FORMAT))).to.throw;
            done();
        });
        it('test getPriceForStartEndDates', (done) => {
            const start = dateAndTime.parse('2018-06-08', dateTools.DAY_FORMAT);
            const end = dateAndTime.parse('2018-06-12', dateTools.DAY_FORMAT);
            const pricePromises = tickerService.getPriceForStartEndDates('Z', [{ start, end }]);
            _.each(pricePromises, (promiseObj) => {
                promiseObj.then((response) => {
                    response.startResponse.price.should.deep.equal(60);
                    response.endResponse.price.should.deep.equal(70);
                    done();
                });
            });
        });
        it('test getPriceForStartEndDate where date is same', (done) => {
            const start = dateAndTime.parse('2018-06-08', dateTools.DAY_FORMAT);
            const end = dateAndTime.parse('2018-06-09', dateTools.DAY_FORMAT);
            const promiseObj = tickerService.getPriceForStartEndDate('Z', start, end);
            promiseObj.then((response) => {
                dateTools.isSameDay(response.startResponse.date, response.endResponse.date).should
                    .be.not.true;
                dateTools.isSameDay(response.startResponse.date, dateAndTime.parse('2018-06-07', dateTools.DAY_FORMAT)).should.be.true;
                response.startResponse.price.should.deep.equal(50);
                response.endResponse.price.should.deep.equal(60);
                done();
            });
        });
    });
});

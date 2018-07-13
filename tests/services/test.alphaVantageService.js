const avService = require('../../src/services/alphaVantageService');
const dbService = require('../../src/services/mongoService');
const tickerService = require('../../src/services/tickerService')(avService, dbService);
const dateAndTime = require('date-and-time');
const _ = require('underscore');

describe('alphaVantageService', () => {
    it.skip('test timeSeriesDaily', () => {
        const pricePromise = tickerService.getPriceForDate('MSFT', dateAndTime.parse('2018-05-24', 'YYYY-MM-DD')).then(result => {
            console.log('hello',  result.price, result.date);
        });
    });
    it.skip('test service again', () => {
        const dateA = dateAndTime.parse('2018-05-24', 'YYYY-MM-DD');
        const dateB = dateAndTime.parse('2018-05-21', 'YYYY-MM-DD');
        const pricePromises = tickerService.getPriceForDates('MSFT', [ dateA, dateB ]);
        _.each(pricePromises, promise => {
            promise.then(result => {
                console.log('hello',  result.price, result.date);
            });
        });
    });
});

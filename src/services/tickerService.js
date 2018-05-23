//const avService = require('./alphaVantageService');
const { get } = require('../utils/objectTools')();
const _ = require('underscore');
const dateAndTime = require('date-and-time');
const dateTools = require('../utils/dateTools')();

module.exports = function tickerService(avService) {
    let useCache = true;
    let cache = {};
    let calledFromNested = false;

    const getPriceForDate = function getPricesForDate(ticker, date) {
        if (_.isEmpty(cache) && !calledFromNested) {
            cache[ticker] = avService.timeSeriesDaily(ticker);
        }

        const tickerInfo = _.chain(cache[ticker].timeSeries)
            .filter(ticker => dateTools.isSameDay(ticker.date, date))
            .first()
            .value();

        if (!useCache && !calledFromNested) {
            cache = {};
        }

        return {
            price: tickerInfo ? tickerInfo.close : null,
            date,
        };
    };

    const getPriceForDates = function getPricesForDates(ticker, dateArray) {
        calledFromNested = true;
        const priceDates = [];
        _.each(dateArray, date => priceDates.push(getPriceForDate(ticker, date)));
        if (!useCache) {
            cache = {};
        }
        calledFromNested = false;
        return priceDates;
    };

    const setUseCache = function setUseCache(setCache) {
        useCache = !!setCache;
        return this;
    };

    return {
        getPriceForDates,
        getPriceForDate,
        setUseCache,
    };
};

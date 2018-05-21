const avService = require('./alphaVantageService');
const { get } = require('../utils/objectTools');
const _ = require('underscore');
const dateAndTime = require('date-and-time');

module.exports = function tickerService() {
    let useCache = true;
    let cache = {};
    let calledFromNested = false;

    const getPriceForDate = function getPricesForDate(ticker, date) {
        if (_.isEmpty(cache) && !calledFromNested) {
            cache[ticker] = avService.timeSeriesDaily(ticker);
        }

        // TODO: pull date format from somewhere
        const dateStr = dateAndTime.format(date, 'YYYY-MM-DD');
        const tickerInfo = get(cache[ticker].timeSeries, dateStr);

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

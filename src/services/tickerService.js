// const avService = require('./alphaVantageService');
const _ = require('underscore');
const dateTools = require('../utils/dateTools');
const tickerInfo = require('../models/tickerInfo');

module.exports = function tickerService(avService) {
    let useCache = true;
    const cache = {};

    const getPriceForDate = function getPriceForDate(ticker, date) {
        if (_.isEmpty(cache) || !useCache) {
            return avService.timeSeriesDaily(ticker)
                .then(result => JSON.parse(result))
                .then(resultJson => tickerInfo('Daily', resultJson))
                .then(convertedResponse => {
                    cache[ticker] = convertedResponse;
                    return findPriceTicker(ticker, date);
                });
        } else {
            return Promise.resolve(findPriceTicker(ticker, date));
        }
    }

    const findPriceTicker = function findPriceTicker(ticker, date) {
        const tickerInfo = _.chain(cache[ticker].timeSeries)
            .filter(localTicker => dateTools.isSameDay(localTicker.date, date))
            .first()
            .value();

        return {
            price: tickerInfo ? tickerInfo.close : null,
            date,
        };
    };

    const getPriceForDates = function getPricesForDates(ticker, dateArray) {
        const priceDates = [];
        _.each(dateArray, date => {
            priceDates.push(getPriceForDate(ticker, date))
        });
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

const _ = require('underscore');
const dateTools = require('../utils/dateTools');
const tickerInfo = require('../models/tickerInfo');
const dateAndTime = require('date-and-time');

module.exports = function tickerService(avService, dbService) {
    let useCache = true;
    const cache = {};
    const fetching = {};

    const findPriceTicker = function findPriceTicker(ticker, date) {
        const tickerPriceInfo = _.chain(cache[ticker].timeSeries)
            .filter(localTicker => dateTools.isSameDay(localTicker.date, date))
            .first()
            .value();

        return {
            price: tickerPriceInfo ? tickerPriceInfo.close : null,
            date,
        };
    };

    const findMinTicker = function findMinTicker(ticker) {
        return _.chain(cache[ticker].timeSeries)
            .min(localTicker => localTicker.date.getTime())
            .value();
    };
    
    const fetchFromAvService = function fetchFromAvService(ticker) {
        return avService.timeSeriesDaily(ticker)
            .then(result => JSON.parse(result))
            .then(resultJson => tickerInfo('Daily', resultJson));
    };

    const fetchFromDb = function fetchFromDb(ticker) {
        return dbService.timeSeriesDaily(ticker);
    };

    const fetchData = function fetchData(ticker) {
        return fetchFromDb(ticker).then((response) => {
            if (response === null) {
                const avResponse = fetchFromAvService(ticker);
                avResponse.then((response) => {
                    dbService.saveTimeSeriesDaily(ticker, response);
                });
                return avResponse;
            }
            return Promise.resolve(response);
        });
    };

    const initCache = function initCache(ticker) {
        if ((_.isEmpty(cache[ticker]) || !useCache)) {
            if (!fetching[ticker]) {
                fetching[ticker] = fetchData(ticker)
                    .then((convertedResponse) => {
                        cache[ticker] = convertedResponse;
                        fetching[ticker] = null;
                        return true;
                    });
            }
            return fetching[ticker];
        }
        return Promise.resolve(true);
    };

    const getPriceForDate = function getPriceForDate(ticker, date) {
        return initCache(ticker).then(() => Promise.resolve(findPriceTicker(ticker, date)));
    };

    const getTickerMinDate = function getTickerMinDate(ticker) {
        return initCache(ticker).then(() => Promise.resolve(findMinTicker(ticker)));
    };

    const getPriceForDateScaling = function getPriceForDateScaling(ticker, date) {
        const pricePromise = getPriceForDate(ticker, date);
        return pricePromise.then((priceObj) => {
            // if price wasn't found on that day (i.e exchange closed, find
            // previous day
            if (priceObj.price === null) {
                return getTickerMinDate(ticker).then((response) => {
                    if (date <= response.date) {
                        // TODO: change this
                        throw new Error('Ticker Info Before ', date, 'Not Available');
                    }
                    return getPriceForDateScaling(ticker, dateAndTime.addDays(date, -1));
                });
            }
            return Promise.resolve(priceObj);
        });
    };

    const getPriceForDates = function getPricesForDates(ticker, dateArray) {
        const priceDates = [];
        _.each(dateArray, (date) => {
            priceDates.push(getPriceForDate(ticker, date));
        });
        return priceDates;
    };

    const equalDateCallback = function equalDateCallback(ticker, startDate, endDate) {
        if (dateTools.isSameDay(startDate, endDate)) {
            return getPriceForDateScaling(ticker, dateAndTime.addDays(startDate, -1));
        }
        return null;
    };

    const getPriceForStartEndDate = function getPriceForStartEndDate(ticker, startDate, endDate) {
        const startPromise = getPriceForDateScaling(ticker, startDate);
        const endPromise = getPriceForDateScaling(ticker, endDate);

        return startPromise.then(startResponse =>
            endPromise.then((endResponse) => {
                const sameDateResponse = equalDateCallback(ticker, startResponse.date, endResponse
                    .date);
                if (sameDateResponse !== null) {
                    return sameDateResponse.then((sdResponse) => {
                        const newResponse = sdResponse;
                        return {
                            startResponse: newResponse,
                            endResponse,
                        };
                    });
                }
                return {
                    startResponse,
                    endResponse,
                };
            }));
    };

    const getPriceForStartEndDates = function getPriceForStartEndDates(ticker, dateObjArray) {
        const priceDatesPromises = [];
        _.each(dateObjArray, (dateObj) => {
            priceDatesPromises.push(getPriceForStartEndDate(ticker, dateObj.start, dateObj.end));
        });
        return priceDatesPromises;
    };

    const setUseCache = function setUseCache(setCache) {
        useCache = !!setCache;
        return this;
    };

    return {
        getPriceForDates,
        getPriceForDate,
        getPriceForDateScaling,
        getPriceForStartEndDates,
        getPriceForStartEndDate,
        getTickerMinDate,
        setUseCache,
    };
};

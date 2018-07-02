const _ = require('underscore');
const { get } = require('../utils/objectTools');
const tickerServiceDefault = require('../services/tickerService');
const avService = require('../services/alphaVantageService');

module.exports = function timeRangePortfolio(portfolio, startDate, endDate) {
    const applicablePurchases = {};
    const fetchStartEndPrices = {};
    const tickerPrices = {};
    let useCache = true;
    let tickerService;

    const setUseCache = function setUseCache(shouldCache) {
        useCache = !!shouldCache;
        return this;
    };

    const setTickerService = function setTickerService(ts) {
        tickerService = ts;
        return this;
    };

    const getTickerService = function getTickerService() {
        if (tickerService === undefined) {
            tickerService = tickerServiceDefault(avService);
        };
        return tickerService;
    };

    const generateTickerPrices = function generateTickerPrices() {
        const promises = {};
        _.mapObject(fetchStartEndPrices, (dates, ticker) => {
            if (_.isEmpty(tickerPrices[ticker]) || useCache === true) {
                const tickerPromises = getTickerService().getPriceForStartEndDates(ticker, dates);
                _.each(tickerPromises, (promiseRange) => {
                    promiseRange.then((rangeResponse) => {
                        tickerPrices[ticker] = {
                            start: rangeResponse.startResponse,
                            end: rangeResponse.endResponse
                        };
                    });
                    promises[ticker] = promiseRange;
                });
            } else {
                promises[ticker] = Promise.resolve(tickerPrices[ticker]);
            }
        });
        return promises;
    };

    const addToHashArray = function addToArray(obj, key, value) {
        if (!_.has(obj, key)) {
            obj[key] = [];
        }
        if (obj[key].indexOf(value) === -1) {
            obj[key].push(value);
        }
        return obj;
    };

    const addStartEndToArray = function addStartEndToArray(obj, key, start, end) {
        if (!_.has(obj, key)) {
            obj[key] = [];
        }
        obj[key].push({
            start,
            end
        });
        return obj;
    };

    const addPurchase = function addPurchase(ticker, purchase, priceStartDate, priceEndDate) {
        purchase.priceStartDate = priceStartDate;
        purchase.priceEndDate = priceEndDate;
        addToHashArray(applicablePurchases, ticker, purchase);
        addStartEndToArray(fetchStartEndPrices, ticker, priceStartDate, priceEndDate);
    };

    const getPurchaseStartDate = function getPurchaseStartDate(boughtDate, beginDate) {
        if (boughtDate < beginDate) {
            return beginDate;
        }
        return boughtDate;
    };

    const getPurchaseEndDate = function getPurchaseEndDate(soldDate, finishDate) {
        if (soldDate === null) {
            return finishDate;
        }
        return soldDate;
    };

    _.mapObject(portfolio.getTickers(), (purchases, ticker) => {
        const filterPurchase = purchase => purchase.boughtDate <= endDate &&
            (purchase.soldDate === null || purchase.soldDate >= startDate);
        _.chain(purchases.getPurchases())
            // ignore everything out of range
            .filter(filterPurchase)
            .each((purchase) => {
                addPurchase(
                    ticker,
                    purchase,
                    getPurchaseStartDate(purchase.boughtDate, startDate),
                    getPurchaseEndDate(purchase.soldDate, endDate),
                );
            });
    });

    const singleGained = function singleGained(endPrice, startPrice) {
        return endPrice - startPrice;
    };

    const gained = function gained(endPrice, startPrice, quantity) {
        return singleGained(endPrice, startPrice) * quantity;
    };

    const percentage = function percentage(amountGained, currentPrice) {
        return (currentPrice - amountGained) / 100;
    };

    const percentGained = function percentGained(oldPrice, newPrice) {
        return (newPrice - oldPrice) / oldPrice;
    };

    const reducePurchasesToAmount = function reducePurchasesToAmount(purchases, ticker, tickerResponse) {
        return _.reduce(purchases, (memo, purchase) => {
            const difference = tickerResponse.endResponse.price - tickerResponse.startResponse.price;
            return memo + (difference * purchase.quantity);
        }, 0);
    };

    const getStatsByTicker = function getStatsByTicker(tickerPromises, purchases, ticker) {
        return tickerPromises[ticker].then((tickerResponse) => {
            return {
                amountGained: reducePurchasesToAmount(purchases, ticker, tickerResponse),
                percentGained: percentGained(tickerResponse.startResponse.price, tickerResponse.endResponse.price),
            };
        });
    };

    const getStatsCombined = function getStatsCombined(allStats) {
        let totalAmountGained = 0;
        let currentAmount = 0;
        _.each(allStats, (stats) => {
            const amountGained = stats.amountGained;
            totalAmountGained += amountGained;
            currentAmount += (amountGained / stats.percentGained) - amountGained;
        });
        return {
            amountGained: totalAmountGained,
            percentGained: totalAmountGained / currentAmount,
        };
    };

    const getStats = function getStats() {
        const tickerPromises = generateTickerPrices();
        const tickerPromiseStats = {};
        _.mapObject(applicablePurchases, (purchases, ticker) => {
            tickerPromiseStats[ticker] = getStatsByTicker(tickerPromises, purchases, ticker);
        });
        return tickerPromiseStats;
    };

    return {
        getStats,
        getStatsCombined,
        setUseCache,
        setTickerService,
    };
};

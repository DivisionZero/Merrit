const _ = require('underscore');
const { get } = require('../utils/objectTools');
const tickerServiceDefault = require('../services/tickerService');
const avService = require('../services/alphaVantageService');
const stringifyObject = require('stringify-object');
const so = stringifyObject;

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
        console.log("Fetch PRices:", fetchStartEndPrices);
        const promises = {};
        _.mapObject(fetchStartEndPrices, (dates, ticker) => {
            if (_.isEmpty(tickerPrices[ticker]) || useCache === true) {
                console.log("dual dates", dates);
                const tickerPromises = getTickerService().getPriceForStartEndDates(ticker, dates);
                _.each(tickerPromises, (promiseRange) => {
                    promiseRange.startPromise.then((startResponse) => {
                        promiseRange.endPromise.then((endResponse) => {
                            console.log('another promise then: ', startResponse, endResponse);
                            tickerPrices[ticker] = {
                                start: startResponse,
                                end: endResponse
                            };
                        });
                    });
                    promises[ticker] = promiseRange;
                });
            } else {
                promises[ticker] = Promise.resolve(tickerPrices[ticker]);
            }
        });
        return promises;
    };

    /*
    const getFromTickerPrices = function getFromTickerPrices(ticker, targetDate, tickerResponse) {
console.log("getFromTickerPrices", ticker, targetDate, so(tickerResponse));
        return tickerPromise.then((response) => {
            return _.chain(get(response, ticker, []))
                .filter(tickerPrice => tickerPrice.date === targetDate)
                .map(tickerPrice => tickerPrice.price)
                .first()
                .value();
        });
    };
    */

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
        /*
        addToHashArray(fetchStartEndPrices, ticker, priceStartDate);
        addToHashArray(fetchStartEndPrices, ticker, priceEndDate);
        */
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

    const reducePurchasesToAmount = function reducePurchasesToAmount(purchases, ticker, tickerResponse) {
console.log("ticker Response", tickerResponse);
        return _.reduce(purchases, (memo, purchase) => {
console.log("purchases", so(purchases));
            // TODO: what to do if it doesn't exist?
            /*/
            const startPrice = tickerResponse.price;
                //getFromTickerPrices(ticker, purchase.priceStartDate, tickerResponse);
            const endPrice = null;
                //getFromTickerPrices(ticker, purchase.priceEndDate, tickerResponse);

            return memo + gained(endPricePromise, startPricePromise, purchase.quantity);
            */
        }, 0);
    };

    const getStats = function getStats() {
        const tickerPromises = generateTickerPrices();
        const tickerPromiseStats = {};
        _.mapObject(applicablePurchases, (purchases, ticker) => {
            tickerPromises[ticker].then((tickerResponse) => {
console.log("Entire ticker Response?", tickerResponse);
                tickerPromiseStats[ticker] = reducePurchasesToAmount(purchases, ticker, tickerResponse);
            });
        });
        return tickerPromiseStats;
    };

    return {
        getStats,
        setUseCache,
        setTickerService,
    };
};

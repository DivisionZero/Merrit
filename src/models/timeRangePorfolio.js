const _ = require('underscore');
const { get } = require('../utils/objectTools');
const tickerService = require('../services/tickerService');

module.exports = function timeRangePortfolio(portfolio, startDate, endDate) {
    const applicablePurchases = {};
    const fetchPrices = {};
    const tickerPrices = {};

    const generateTickerPrices = function getTickerPrices() {
        _.mapObject(fetchPrices, (ticker, dates) => {
            tickerPrices[ticker] = tickerService.getPriceForDates(ticker, dates);
        });
    };

    const getFromTickerPrices = function getFromTickerPrices(ticker, targetDate) {
        return _.chain(get(tickerPrices, ticker, []))
            .filter(tickerPrice => tickerPrice.date === targetDate)
            .map(tickerPrice => tickerPrice.price)
            .first()
            .value();
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

    const addPurchase = function addPurchase(ticker, purchase, priceStartDate, priceEndDate) {
        purchase.priceStartDate = priceStartDate;
        purchase.priceEndDate = priceEndDate;
        addToHashArray(applicablePurchases, ticker, purchase);
        addToHashArray(fetchPrices, ticker, priceStartDate);
        addToHashArray(fetchPrices, ticker, priceEndDate);
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

    _.mapObject(portfolio.getTickers(), (ticker, purchases) => {
        const filterPurchase = purchase => purchase.boughtDate <= endDate &&
            (purchase.soldDate === null || purchase.soldDate >= startDate);
        _.chain(purchases)
            // ignore everything out of range
            .filter(filterPurchase)
            .each((purchase) => {
                addPurchase(
                    ticker,
                    purchase,
                    getPurchaseStartDate(purchase.boughtDate, startDate),
                    getPurchaseEndDate(purchase.endDate, endDate),
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

    const getStats = function getStats(clearCache) {
        if (_.isEmpty(tickerPrices) || clearCache === true) {
            generateTickerPrices();
        }
        const tickerStats = {};
        // let percentGained = 0;
        // const amountTotal = 0;
        let amountGained = 0;
        _.mapObject(applicablePurchases, (ticker, purchases) => {
            const tickerAmountGained = _.reduce(purchases, (memo, purchase) => {
                // TODO: what to do if it doesn't exist?
                const startPrice =
                    getFromTickerPrices(ticker, purchase.priceStartDate);
                const endPrice =
                    getFromTickerPrices(ticker, purchase.priceEndDate);

                return memo + gained(endPrice, startPrice, purchase.quantity);
            }, 0);
            amountGained += tickerAmountGained;
            tickerStats[ticker] = amountGained;
        });

        return {
            // percentGained: amountGained / amountTotal;
            amountGained,
            tickerStats,
        };
    };

    return {
        getStats,
    };
};

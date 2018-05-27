const _ = require('underscore');
const { get, getStr } = require('../utils/objectTools');

module.exports = function portfolio() {
    const tickers = {};
    const addPurchase = function addPurchase(purchaseInfo) {
        const ticker = getStr(purchaseInfo, 'tickerSymbol');
        if (_.has(tickers, ticker)) {
            tickers[ticker].addMany(purchaseInfo.getPurchases());
        } else {
            tickers[ticker] = purchaseInfo;
        }
        return this;
    };
    const removePurchase = function removePurchase() {
        throw new Error('not implemented!');
    };
    const total = function total(tickerSymbol) {
        const tickersLocal = (tickerSymbol) ?
            [get(tickers, tickerSymbol, [])] :
            _.values(tickers);
        return _.reduce(tickersLocal, (memo, purchase) => memo + purchase.total(), 0);
    };

    return {
        total,
        addPurchase,
        removePurchase,
    };
};

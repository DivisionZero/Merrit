const _ = require('underscore');

module.exports = function purchaseInfo(tickerSymbol) {
    const purchases = [];
    const add = function add(purchase) {
        purchases.push(purchase);
        return this;
    };
    const remove = function remove() {
        throw new Error('not implemented!');
    };
    const total = function total() {
        return _.reduce(purchases, (memo, num) => memo + num.total, 0);
    };

    return {
        tickerSymbol,
        add,
        remove,
        total,
    };
};

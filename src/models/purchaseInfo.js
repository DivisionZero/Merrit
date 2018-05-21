const _ = require('underscore');

module.exports = function purchaseInfo(tickerSymbol) {
    let purchases = [];
    const add = function add(purchase) {
        purchases.push(purchase);
        return this;
    };
    const addMany = function addMany(purchasesLocal) {
        purchases = purchases.concat(purchasesLocal);
    };
    const remove = function remove() {
        throw new Error('not implemented!');
    };
    const total = function total() {
        return _.reduce(purchases, (memo, num) => memo + num.total, 0);
    };
    const getPurchases = function getPurchases() {
        return purchases.slice(0);
    };

    return {
        tickerSymbol,
        add,
        addMany,
        remove,
        total,
        getPurchases,
    };
};

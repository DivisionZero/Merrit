const { getDate, getNumber } = require('../utils/objectTools')();

module.exports = function purchasePriceInfo(purchaseInfo = {}) {
    const price = getNumber(purchaseInfo, 'price');
    const quantity = getNumber(purchaseInfo, 'quantity');
    // TODO: deal with splits
    return {
        price,
        // TODO: check for format of date
        boughtDate: getDate(purchaseInfo, 'boughtDate', null),
        soldDate: getDate(purchaseInfo, 'boughtDate', null),
        quantity,
        total: price * quantity,
    };
};

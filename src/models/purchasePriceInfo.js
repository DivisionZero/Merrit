const { getNumber, get } = require('../utils/objectTools')();

module.exports = function purchasePriceInfo(purchaseInfo = {}) {
    const price = getNumber(purchaseInfo, 'price');
    const quantity = getNumber(purchaseInfo, 'quantity');
    // TODO: deal with splits
    return {
        price,
        // TODO: check for format of date
        date: get(purchaseInfo, 'date'),
        quantity,
        total: price * quantity,
    };
};

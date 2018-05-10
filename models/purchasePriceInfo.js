
module.exports = function(purchaseInfo = {}) {
    const {
        price,
        date,
        quantity
    } = purchaseInfo;

    // TODO: deal with splits
    return {
        price: Number(price),
        // TODO: check for format of date
        date: date,
        quantity: Number(quantity),
        total: Number(price * quantity),
    };
}

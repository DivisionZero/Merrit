const _ = require('underscore');

module.exports = function(tickerSymbol){
    let purchases = [];
    const add = function(purchase){
        purchases.push(purchase);
    },
    remove = function(){
        console.log('not implementedyet!');
    },
    total = function(){
        return _.reduce(purchases, function(memo, num){
            return memo + num.total;
        }, 0);
    };

    return {
        tickerSymbol,
        add,
        remove,
        total
    };
};

const _ = require('underscore');
const dateTools = require('../utils/dateTools');

const tickerInfoDbAdapter = function tickerInfoDbAdapter(dbResponse) {
    const timeSeriesArray = _.map(dbResponse, (entry) => {
        return {
            open: entry.open,
            close: entry.close,
            high: entry.high,
            low: entry.low,
            volume: entry.volume,
            date: dateTools.toDate(entry.date),
        };
    });

    return {
        metaData: {},
        timeSeries: timeSeriesArray,
    };
}

module.exports = tickerInfoDbAdapter;

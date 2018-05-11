const tickerPriceInfo = require('./tickerPriceInfo');
const _ = require('underscore');
const { get, getString } = require('../utils/objectTools')();

const TIME_SERIES = 'Time Series';

const tickerInfo = function tickerInfo(metaData, timeSeriesData) {
    // TODO: validate timeSeries
    const timeSeriesInterval = getString(metaData, 'interval');
    const timeSeriesStr = `${TIME_SERIES} (${timeSeriesInterval})`;
    const timeSeries = get(timeSeriesData, timeSeriesStr, {});
    const timeSeriesArray = _.mapObject(timeSeries, (value, key) => tickerPriceInfo(key, value));
    return {
        metaData,
        timeSeries: _.sortBy(timeSeriesArray, (a, b) => a.date - b.date),
    };
};

module.exports = tickerInfo;

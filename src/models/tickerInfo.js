const tickerPriceInfo = require('./tickerPriceInfo');
const metaData = require('./tickerMetaData');
const _ = require('underscore');
const { get, getString } = require('../utils/objectTools');

const TIME_SERIES = 'Time Series';

const tickerInfo = function tickerInfo(timeSeriesInterval, apiData) {
    // TODO: validate timeSeries
    const timeSeriesStr = `${TIME_SERIES} (${timeSeriesInterval})`;
    const timeSeries = get(apiData, timeSeriesStr, {});
    const timeSeriesArray = _.mapObject(timeSeries, (value, key) => tickerPriceInfo(key, value));
    return {
        metaData: metaData(get(apiData, 'Meta Data', {})),
        timeSeries: _.sortBy(timeSeriesArray, (a, b) => a.date - b.date),
    };
};

module.exports = tickerInfo;

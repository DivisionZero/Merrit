const tickerPriceInfo = require('./tickerPriceInfo');
const metaData = require('./tickerMetaData');
const _ = require('underscore');
const { get } = require('../utils/objectTools');
const { constants } = require('../services/alphaVantageService');

const tickerInfo = function tickerInfo(timeSeriesInterval, apiData) {
    // TODO: validate timeSeries
    const timeSeriesStr = `${constants.TIME_SERIES} (${timeSeriesInterval})`;
    const timeSeries = get(apiData, timeSeriesStr, {});
    const timeSeriesArray = _.mapObject(timeSeries, (value, key) => tickerPriceInfo(key, value));
    return {
        metaData: metaData(get(apiData, constants.META_DATA, {}), timeSeriesInterval),
        timeSeries: _.sortBy(timeSeriesArray, (a, b) => a.date - b.date),
    };
};

module.exports = tickerInfo;

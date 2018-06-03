const _ = require('underscore');
const date = require('date-and-time');
const { getNumber } = require('../utils/objectTools');
const { DAY_FORMAT, MINUTE_FORMAT } = require('../utils/dateTools');

const VALID_FIELD_NAMES = {
    '1. open': 'open', 
    '2. high': 'high', 
    '3. low': 'low', 
    '4. close': 'close', 
    '5. volume': 'volume',
};

const tickerPriceInfo = function tickerPriceInfo(timeSeriesStr, rawInfo = {}) {
    const tickerInfo = {};
    const dateFormat = timeSeriesStr.split(' ').length === 2 ? MINUTE_FORMAT : DAY_FORMAT;
    _.mapObject(VALID_FIELD_NAMES, (internalKey, apiKey) => {
        // TODO: function that does this in underscore?
        tickerInfo[internalKey] = getNumber(rawInfo, apiKey, null);
    });

    // TODO: universal function that formats dates?
    tickerInfo.date = timeSeriesStr ? date.parse(String(timeSeriesStr), dateFormat) : null;
    return tickerInfo;
};

module.exports = tickerPriceInfo;

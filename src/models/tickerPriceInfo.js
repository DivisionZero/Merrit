const _ = require('underscore');
const date = require('date-and-time');
const { getNumber } = require('../utils/objectTools');
const { DAY_FORMAT, MINUTE_FORMAT } = require('../utils/dateTools');

const VALID_FIELD_NAMES = ['open', 'high', 'low', 'close', 'volume'];

const tickerPriceInfo = function tickerPriceInfo(timeSeriesStr, rawInfo = {}) {
    const tickerInfo = {};
    const dateFormat = timeSeriesStr.split(' ').length === 2 ? MINUTE_FORMAT : DAY_FORMAT;
    _.each(VALID_FIELD_NAMES, (entry) => {
        // TODO: function that does this in underscore?
        tickerInfo[entry] = getNumber(rawInfo, entry, null);
    });

    // TODO: universal function that formats dates?
    tickerInfo.date = timeSeriesStr ? date.parse(String(timeSeriesStr), dateFormat) : null;
    return tickerInfo;
};

module.exports = tickerPriceInfo;

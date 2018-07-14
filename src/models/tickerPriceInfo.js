const _ = require('underscore');
const date = require('date-and-time');
const { getNumber } = require('../utils/objectTools');
const { DAY_FORMAT, MINUTE_FORMAT } = require('../utils/dateTools');
const { constants } = require('../services/alphaVantageService');

const VALID_FIELD_NAMES = {};
VALID_FIELD_NAMES[constants.OPEN] = 'open';
VALID_FIELD_NAMES[constants.HIGH] = 'high';
VALID_FIELD_NAMES[constants.LOW] = 'low';
VALID_FIELD_NAMES[constants.CLOSE] = 'close';
VALID_FIELD_NAMES[constants.VOLUME] = 'volume';

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

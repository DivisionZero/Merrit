const _ = require('underscore');
const date = require('date-and-time');
const { getNumber } = require('../utils/objectTools');
const dateTools = require('../utils/dateTools');
const { constants } = require('../services/alphaVantageService');

const VALID_FIELD_NAMES = {};
VALID_FIELD_NAMES[constants.OPEN] = 'open';
VALID_FIELD_NAMES[constants.HIGH] = 'high';
VALID_FIELD_NAMES[constants.LOW] = 'low';
VALID_FIELD_NAMES[constants.CLOSE] = 'close';
VALID_FIELD_NAMES[constants.VOLUME] = 'volume';

const tickerPriceInfo = function tickerPriceInfo(date, rawInfo = {}) {
    const tickerInfo = {};
    _.mapObject(VALID_FIELD_NAMES, (internalKey, apiKey) => {
        // TODO: function that does this in underscore?
        tickerInfo[internalKey] = getNumber(rawInfo, apiKey, null);
    });

    tickerInfo.date = dateTools.toDate(date);
    return tickerInfo;
};

module.exports = tickerPriceInfo;

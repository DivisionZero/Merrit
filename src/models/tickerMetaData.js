const { getStr, getDate } = require('../utils/objectTools');
const { DAY_FORMAT } = require('../utils/dateTools');
const { constants } = require('../services/alphaVantageService');

const metaData = function metaData(rawData, timeSeriesInterval) {
    return {
        symbol: getStr(rawData, constants.SYMBOL, null),
        // TODO: universal date function?
        lastRefreshed: getDate(rawData, constants.LAST_REFRESHED, null, DAY_FORMAT),
        timeZone: getStr(rawData, constants.TIME_ZONE, null),
        interval: timeSeriesInterval,
    };
};

module.exports = metaData;

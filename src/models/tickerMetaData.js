const { getStr, getDate } = require('../utils/objectTools');
const { DAY_FORMAT } = require('../utils/dateTools');

const DAILY = 'Daily';

const metaData = function metaData(rawData) {
    return {
        symbol: getStr(rawData, 'Symbol'),
        // TODO: universal date function?
        lastRefreshed: getDate(rawData, 'Last Refreshed', null, DAY_FORMAT),
        timeZone: getStr(rawData, 'Time Zone'),
        interval: getStr(rawData, 'Interval', DAILY),
    };
};

module.exports = metaData;

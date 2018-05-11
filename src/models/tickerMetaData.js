const { getStr, getDate } = require('../utils/objectTools')();

// TODO: will this date formatting be outside this class?
// MINUTE_FORMAT = "${DAY_FORMAT} HH:mm:ss",
const DAILY = 'Daily';
const DAY_FORMAT = 'YYYY-MM-DD';

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

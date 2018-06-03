const { getStr, getDate } = require('../utils/objectTools');
const { DAY_FORMAT } = require('../utils/dateTools');

const DAILY = 'Daily';

const metaData = function metaData(rawData) {
    return {
        symbol: getStr(rawData, '2. Symbol', null),
        // TODO: universal date function?
        lastRefreshed: getDate(rawData, '3. Last Refreshed', null, DAY_FORMAT),
        timeZone: getStr(rawData, '5. Time Zone', null),
        interval: getStr(rawData, 'Interval', DAILY),
    };
};

module.exports = metaData;

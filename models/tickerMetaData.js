const date = require('date-and-time'),
      VALID_FIELD_NAMES = ['Symbol', 'Time Zone', 'Last Refreshed', 'Interval'],
      // TODO: will this date formatting be outside this class?
      DAY_FORMAT = 'YYYY-MM-DD',
      MINUTE_FORMAT = "${DAY_FORMAT} HH:mm:ss",
      DAILY = 'Daily';

const metaData = function(rawData){
    return {
        symbol: String(rawData.Symbol),
        // TODO: universal date function?
        lastRefreshed: rawData['Last Refreshed'] ? date.parse(String(rawData['Last Refreshed']), DAY_FORMAT) : null,
        timeZone: String(rawData['Time Zone']),
        interval: rawData['Interval'] ? rawData['Interval'] : DAILY
    };
};

module.exports = metaData;

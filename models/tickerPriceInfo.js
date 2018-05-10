const _ = require('underscore'),
      date = require('date-and-time'),
      // TODO: will this date formatting be outside this class?
      DAY_FORMAT = 'YYYY-MM-DD',
      MINUTE_FORMAT = "${DAY_FORMAT} HH:mm:ss",
      VALID_FIELD_NAMES = ['open', 'high', 'low', 'close', 'volume'];

const tickerPriceInfo = function(timeSeriesStr, rawInfo = {}){
    let tickerInfo = {},
        dateFormat = timeSeriesStr.split(' ').length == 2 ? MINUTE_FORMAT : DAY_FORMAT;
    _.each(VALID_FIELD_NAMES, function(entry){
        // TODO: function that does this in underscore?
        tickerInfo[entry] = Number(rawInfo[entry]);
    });

    // TODO: universal function that formats dates?
    tickerInfo['date'] = timeSeriesStr ? date.parse(String(timeSeriesStr), dateFormat) : null; 
    return tickerInfo;
};

module.exports = tickerPriceInfo;

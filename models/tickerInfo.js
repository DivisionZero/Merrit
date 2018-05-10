const tickerPriceInfo = require("./tickerPriceInfo"),
      _ = require('underscore'),
      TIME_SERIES = 'Time Series';

var tickerInfo = function(metaData, timeSeriesData){
    // TODO: validate timeSeries
    const timeSeriesInterval = metaData.interval,
          timeSeriesStr = `${TIME_SERIES} (${timeSeriesInterval})`,
          timeSeries = timeSeriesData[timeSeriesStr] || {};
    const timeSeriesArray = _.mapObject(timeSeries, function(value, key){
        return tickerPriceInfo(key, value);
    });
    return {
        timeSeries: timeSeries,
        metaData: metaData,
        timeSeries: _.sortBy(timeSeriesArray, function(a, b){
            return a.date - b.date;
        }),
    };
};

module.exports = tickerInfo;

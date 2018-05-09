var tickerPriceInfo = require("./tickerPriceInfo");

var tickerInfo = function(metaData, timeSeries, timeSeriesData){
    // TODO: es6 print formatting
    // TODO: validate timeSeries
    var timeSeriesStr = TIME_SERIES + "(" + timeSeries + ")";
    var timeSeries = rawInfo[timeSeriesStr];
    var timeSeriesArray = [];
    // TODO: use underscore to pull a parameters for this object instead
    // TODO: sort keys
    Object.keys(timeSeries).forEach(function(key, value){
       timeSeriesArray.append(tickerPriceInfo(key, value)); 
    });

    return {
        timeSeries: timeSeries,
        metaData: metaData,
        timeSeries: timeSeriesArray,
    };
};

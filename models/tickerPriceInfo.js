module.exports = function(timeSeriesStr, rawInfo){
    // todo: destructure this
    // todo: use underscore
    // TODO: use ES6 for linting
    var tickerInfo = {};
    ['open', 
     'high', 
     'low', 
     'close', 
     'volume'].forEach(function(entry){
        tickerInfo[entry] = Number(rawInfo[entry]);
    });
    // TODO: cast to date?
    tickerInfo['date'] = String(timeSeriesStr);
    return tickerInfo;
};

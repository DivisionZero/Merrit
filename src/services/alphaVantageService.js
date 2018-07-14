const { ALPHA_VANTAGE } = require('../config/service');
const httpTools = require('../utils/httpTools');

const PATH = '/query';
const series = {
    TIME_SERIES_DAILY: 'TIME_SERIES_DAILY',
};
const constants = {
    OPEN: '1. open',
    HIGH: '2. high',
    LOW: '3. low',
    CLOSE: '4. close',
    VOLUME: '5. volume',
    META_DATA: 'Meta Data',
    TIME_ZONE: '5. Time Zone',
    OUTPUT_SIZE: '4. Output Size',
    TIME_SERIES_DAILY: 'Time Series (Daily)',
    SYMBOL: '2. Symbol',
    LAST_REFRESHED: '3. Last Refreshed',
    US_EASTERN: 'US/Eastern',
    TIME_SERIES: 'Time Series',
    DAILY: 'Daily',
};

const alphaVantageService = function alphaVantageService() {
    const buildParamsObj = function buildParamsObj(params) {
        params.apikey = ALPHA_VANTAGE.apikey;
        return params;
    };
    const timeSeriesDaily = function timeSeriesDaily(ticker) {
console.log("Making Get for: ", ticker);
        const queryParams = buildParamsObj({
            symbol: ticker.toUpperCase(),
            function: series.TIME_SERIES_DAILY,
        });
        // TODO: handle errors
        return httpTools.simpleGet(ALPHA_VANTAGE.host, PATH, queryParams);
    };
    return {
        timeSeriesDaily,
        constants
    };
};

module.exports = alphaVantageService();

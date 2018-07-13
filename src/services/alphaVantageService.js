const { ALPHA_VANTAGE } = require('../config/service');
const httpTools = require('../utils/httpTools');

const PATH = '/query';
const series = {
    TIME_SERIES_DAILY: 'TIME_SERIES_DAILY',
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
    };
};

module.exports = alphaVantageService();

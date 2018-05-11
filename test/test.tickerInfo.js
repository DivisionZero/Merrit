const assert = require('assert'),
      tickerPriceInfo = require('../src/models/tickerPriceInfo'),
      metaData = require('../src/models/tickerMetaData'),
      tickerInfo = require('../src/models/tickerInfo'),
      date = require('date-and-time');

describe('tickerInfo', () => {
    // TODO: change this!
    it('verify this works', () => {
        const metaDataObj = {};
        metaDataObj.Symbol = 'MSFT';
        metaDataObj['Last Refreshed'] = '2018-05-08';
        metaDataObj['Time Zone'] = 'US/Eastern';
        const md = metaData(metaDataObj);
        let timeSeriesData = {};
        const timeSeriesName = 'Time Series (Daily)';
        timeSeriesData[timeSeriesName] = {};
        timeSeriesData[timeSeriesName]['2018-05-07'] = {
            open: 10.00,
            high: 11.00,
            low: 9.13,
            close: 10.45,
            volume: 1000343,
        };

        const tickerInfoObj = tickerInfo(md, timeSeriesData);

        assert.equal(tickerInfoObj.timeSeries.length, 1);
    });
});

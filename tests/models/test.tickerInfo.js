const chai = require('chai');
const metaData = require('../../src/models/tickerMetaData');
const tickerInfo = require('../../src/models/tickerInfo');
chai.should();

describe('tickerInfo', () => {
    it('test object creation', () => {
        const metaDataObj = {};
        metaDataObj.Symbol = 'MSFT';
        metaDataObj['Last Refreshed'] = '2018-05-08';
        metaDataObj['Time Zone'] = 'US/Eastern';
        const md = metaData(metaDataObj);
        const timeSeriesData = {};
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

        tickerInfoObj.timeSeries.length.should.equal(1);
    });
});

const chai = require('chai');
const tickerInfo = require('../../src/models/tickerInfo');
const { constants } = require('../../src/services/alphaVantageService');
const { isSameDay, DAY_FORMAT } = require('../../src/utils/dateTools');
const dateAndTime = require('date-and-time');

chai.should();

describe('tickerInfo', () => {
    it('test object creation', () => {
        const metaDataObj = {};
        const close = 10.45;
        const lastRefreshed = '2018-05-08';
        metaDataObj[constants.SYMBOL] = 'MSFT';
        metaDataObj[constants.LAST_REFRESHED] = lastRefreshed;
        metaDataObj[constants.TIME_ZONE] = constants.US_EASTERN;
        let timeSeriesData = {};
        const timeSeriesName = constants.TIME_SERIES_DAILY;
        timeSeriesData = {};
        timeSeriesData['2018-05-07'] = {};
        timeSeriesData['2018-05-07'][constants.OPEN] = 10.00;
        timeSeriesData['2018-05-07'][constants.HIGH] = 11.00;
        timeSeriesData['2018-05-07'][constants.LOW] = 9.13;
        timeSeriesData['2018-05-07'][constants.CLOSE] = close;
        timeSeriesData['2018-05-07'][constants.VOLUME] = 1000343;
        const apiObj = {};
        apiObj[constants.META_DATA] = metaDataObj;
        apiObj[timeSeriesName] = timeSeriesData;
        const tickerInfoObj = tickerInfo(constants.DAILY, apiObj);

        tickerInfoObj.timeSeries.length.should.equal(1);
        tickerInfoObj.timeSeries[0].close.should.deep.equal(close);
        isSameDay(dateAndTime.parse(lastRefreshed, DAY_FORMAT), tickerInfoObj.metaData
            .lastRefreshed).should.be.true;
    });
});

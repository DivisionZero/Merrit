const tickerSvc = require('../../src/services/tickerService');
const tickerInfo = require('../../src/models/tickerInfo');
const dateAndTime = require('date-and-time');
const assert = require('assert');
const dateTool = require('../../src/utils/dateTools')();

describe('tickerService', () => {
    let tickerService;
    const now = new Date();
    const price = 100;
    beforeEach(function(){
        tickerService = tickerSvc({
            timeSeriesDaily: function(ticker) {
                const timeSeriesData = {};
                // TODO: don't hardcode this
                timeSeriesData['Time Series (Daily)'] = {};
                timeSeriesData['Time Series (Daily)'][dateAndTime.format(now, 'YYYY-MM-DD')] =  {
                    close: price
                }
                const tickerObj = tickerInfo({interval: 'Daily'}, timeSeriesData);
                return tickerObj;
            }
        });
    });
    it.only('test getPriceForDate', () => {
        const priceObj = tickerService.getPriceForDate('Z', now);
        assert.equal(price, priceObj.price);
        assert.equal(true, dateTool.isSameDay(now, priceObj.date));
    });
});

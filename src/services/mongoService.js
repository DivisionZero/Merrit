const mongoose = require('mongoose');
const tickerSchema = require('../schemas/tickerSchema');
const dateAndTime = require('date-and-time');
const dateTools = require('../utils/dateTools');
const tickerInfoDbAdapter = require('../models/tickerInfoDbAdapter');
const _ = require('underscore');

const Ticker = mongoose.model('Ticker', tickerSchema);

const dbService = function dbService() {
    // TODO: handle dates better
    const timeSeriesDaily = function timeSeriesDaily(ticker, date) {
        console.log('db ticker', ticker, date);
        const data = {
            ticker,
        };
        if (date) {
            data.date = dateAndTime.format(date, dateTools.MINUTE_FORMAT);
        }
        return Ticker.find(data).exec()
            .then(result => tickerInfoDbAdapter(result));
    };

    const saveTimeSeriesDaily = function saveTimeSeriesDaily(ticker, tickerInfo) {
        console.log('db save', ticker);

        _.each(tickerInfo.timeSeries, function(tickerPriceInfo) {
            saveTicker(ticker, tickerPriceInfo);
        });
    };

    // TODO: find out how to save multi
    const saveTicker = function saveTicker(ticker, tickerPriceInfo) {
        const tickerObj = new Ticker({
            ticker,
            open: tickerPriceInfo.open,
            close: tickerPriceInfo.close,
            high: tickerPriceInfo.high,
            low: tickerPriceInfo.low,
            volume: tickerPriceInfo.volume,
            date: dateAndTime.format(tickerPriceInfo.date, dateTools.MINUTE_FORMAT),
        });
        return tickerObj.save();
    };

    return {
        saveTicker,
        timeSeriesDaily,
        saveTimeSeriesDaily,
    };
};

module.exports = dbService();

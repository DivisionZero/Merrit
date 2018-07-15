const mongoose = require('mongoose');
const tickerDefinition = require('./tickerDefinition');
const tickerPriceInfo = require('../models/tickerPriceInfo');
const dateAndTime = require('date-and-time');

const { Schema } = mongoose;

const tickerSchema = new Schema({
    ticker: tickerDefinition,
    open: Number,
    close: Number,
    high: Number,
    low: Number,
    volume: Number,
    date: String,
});

tickerSchema.methods.toTickerPriceInfo = function() {
    return tickerPriceInfo(this.date, {
        open: this.open,
        close: this.close,
        low: this.low,
        high: this.high,
        volume: this.volume,
    });
};

module.exports = tickerSchema;

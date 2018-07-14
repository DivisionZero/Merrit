const dateAndTime = require('date-and-time');
const _ = require('underscore');

const dateTools = function dateTools() {
    const DAY_FORMAT = 'YYYY-MM-DD';
    const MINUTE_FORMAT = `${DAY_FORMAT} HH::mm:ss`;

    const toUnixTimestamp = function toUnixTimestamp(date) {
        return parseInt((toDate(date).getTime() / 1000).toFixed(0), 10);
    };

    // Can only parse DAY_FORMAT and MINUTE_FORMAT strings
    const stringToDate = function stringToDate(dateStr) {
        const dateFormat = dateStr.split(' ').length === 2 ? MINUTE_FORMAT : DAY_FORMAT;
        const convertedDate = dateAndTime.parse(dateStr, dateFormat); 
        if (_.isNaN(convertedDate)) {
            throw new TypeError(`"${dateStr}" is not a valid date format`);
        };
        return convertedDate;
    };

    const numberToDate = function numberToDate(unixTimestamp) {
        return new Date(unixTimestamp * 1000);
    };

    const toDate = function toDate(date) {
        if (_.isDate(date)) {
            return date;
        }
        if (_.isString(date)) {
            return stringToDate(date);
        }
        if (!_.isNaN(date) && _.isNumber(date)) {
            return numberToDate(date);
        }
        const type = typeof date;
        throw new TypeError(`Cannot convert type ${type} to date`);
    };

    const areTimesSame = function areTimesSame(timeA, timeB, format) {
        return dateAndTime.format(toDate(timeA), format) ===
            dateAndTime.format(toDate(timeB), format);
    };

    const isSameDay = function isSameDay(dateA, dateB) {
        return areTimesSame(dateA, dateB, DAY_FORMAT);
    };

    const isSameTime = function isSameTime(timeA, timeB) {
        return areTimesSame(timeA, timeB, MINUTE_FORMAT);
    }

    return {
        toUnixTimestamp,
        isSameDay,
        isSameTime,
        toDate,
        stringToDate,
        numberToDate,
        DAY_FORMAT,
        MINUTE_FORMAT,
    };
};

module.exports = dateTools();

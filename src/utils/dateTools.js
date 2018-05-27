const dateAndTime = require('date-and-time');
const _ = require('underscore');

const dateTools = function dateTools() {
    const DAY_FORMAT = 'YYYY-MM-DD';
    const MINUTE_FORMAT = `${DAY_FORMAT} HH::mm:ss`;

    const isSameDay = function isSameDay(dateA, dateB) {
        if (!_.isDate(dateA) || !_.isDate(dateB)) {
            throw new TypeError('dateA and dateB must be Date objects');
        }
        return dateAndTime.format(dateA, DAY_FORMAT) === dateAndTime.format(dateB, DAY_FORMAT); 
    };

    const convertStringDayToDate = function convertStringDayToDate(Day_YYYY_MM_DD) {

    }

    return {
        isSameDay,
        DAY_FORMAT,
        MINUTE_FORMAT,
    };
};

module.exports = dateTools();

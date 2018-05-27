const _ = require('underscore');
const date = require('date-and-time');

const objectTools = function objectTools() {
    const defaultError = "obj must be an object or defaultValue must be provided.";
    const round = function round(value, decimals) {
        return Number(`${Math.round(`${value}e${decimals}`)}e-${decimals}`);
    };
    const returnDefaultOrError = function returnDefaultOrError(defaultValue) {
        if (defaultValue === undefined) {
            throw new TypeError(defaultError);
        }
        return defaultValue;
    };
    const get = function get(obj, key, defaultValue, transFunc) {
        if (!_.isObject(obj)) {
            return returnDefaultOrError(defaultValue);
        }
        if (_.has(obj, key)) {
            if (_.isFunction(transFunc)) {
                return transFunc(obj[key]);
            }
            return obj[key];
        }
        return returnDefaultOrError(defaultValue);
    };
    const getString = function getString(obj, key, defaultValue) {
        return get(obj, key, defaultValue, string => String(string));
    };
    const getNumber = function getNumber(obj, key, defaultValue, precision) {
        return get(obj, key, defaultValue, (number) => {
            if (_.isNumber(precision)) {
                return round(number, precision);
            }
            return Number(number);
        });
    };
    const getDate = function getDate(obj, key, defaultValue, dateFormat) {
        const dateValue = get(obj, key, defaultValue);
        if (_.isDate(dateValue)) {
            return dateValue;
        }
        // TODO: check for numbers
        if (_.isString(dateValue)) {
            // TODO: default dateFormat
            return date.parse(dateValue, dateFormat);
        }
        return defaultValue;
    };

    return {
        get,
        getString,
        getNumber,
        getStr: getString,
        getNum: getNumber,
        getDate,
    };
};

module.exports = objectTools();

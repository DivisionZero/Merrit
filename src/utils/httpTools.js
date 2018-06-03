const queryString = require('query-string');
const _ = require('underscore');
const request = require('request-promise');

const httpTools = function httpTools() {
    const buildFullUrl = function buildFullUrl(host, path, queryParams) {
        let qParams = queryParams;
        if (_.isObject(queryParams)) {
            qParams = queryString.stringify(qParams);
        }
        return [host, path, '?', qParams].join('');
    };
    const simpleGet = function simpleGet(host, path, queryParams) {
        return request.get(buildFullUrl(host, path, queryParams));
        /*
            .then(response => {
                return response;
            });
            */
        // TODO: error handling?
    };

    return {
        buildFullUrl,
        simpleGet,
    };
};

module.exports = httpTools();

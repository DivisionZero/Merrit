const queryString = require('query-string');
const _ = require('underscore');
const request = require('request-promise');

const httpTools = function httpTools() {
    const TIMEOUT = 10000;
    const buildFullUrl = function buildFullUrl(host, path, queryParams) {
        let qParams = queryParams;
        if (_.isObject(queryParams)) {
            qParams = queryString.stringify(qParams);
        }
        return [host, path, '?', qParams].join('');
    };
    const simpleGet = function simpleGet(host, path, queryParams) {
        const options = {
            url: buildFullUrl(host, path, queryParams),
            timeout: TIMEOUT,
        };
        return request.get(options)
            .catch(e => {
                console.log(e);
            });
        // TODO: error handling?
    };

    return {
        buildFullUrl,
        simpleGet,
    };
};

module.exports = httpTools();

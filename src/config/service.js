const ini = require('ini');
const fs = require('fs');

const config = ini.parse(fs.readFileSync('env.ini', 'utf-8'));

module.exports = {
    ALPHA_VANTAGE: {
        host: 'https://www.alphavantage.co',
        // TODO: don't check this in
        apikey: config.alphavantage.apikey,
    },
};

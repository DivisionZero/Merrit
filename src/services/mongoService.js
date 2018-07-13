const mongoService = function dbService() {
    const timeSeriesDaily = function timeSeriesDaily(ticker) {
        console.log('db ticker', ticker);
        return Promise.resolve(null);
    };

    const saveTimeSeriesDaily = function saveTimeSeriesDaily(ticker, response) {
        console.log('db save', ticker);
    };

    return {
        timeSeriesDaily,
        saveTimeSeriesDaily,
    };
};

module.exports = mongoService();

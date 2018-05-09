var metaData = function(rawData){
    // TODO: destructure

    return {
        symbol: String(rawData.Symbol),
        // TODO: cast to date?
        lastRefreshed: String(rawData['Last Refreshed']),
        timeZone: String(rawData['Time Zone']),
    };
};

// convert '/Date(1635264000110)/' to JS Date
function convertEpoch(epoch) {
    try {
        var epochMilliseconds = parseInt(epoch.substring(6, 19));
        var date = new Date(0);
        date.setUTCMilliseconds(epochMilliseconds);
        return date;
    } catch (e) {
        console.log(`[convertEpoch] ${e}`);
    }
}

// convert '/Date(1635264000110)/' to 1635264000110
function stripEpochDate(epoch) {
    try {
        return parseInt(epoch.substring(6, 19));
    } catch (e) {
        console.log(`[stripEpochDate] ${e}`);
    }
}

module.exports = {
    convertEpoch,
    stripEpochDate
};
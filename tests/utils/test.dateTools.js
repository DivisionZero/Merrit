const dateAndTime = require('date-and-time');
const dateTool = require('../../src/utils/dateTools')();
const assert = require('assert');

describe('dateTools', () => {
    it('Test isSameDay', () => {
        const now = new Date();
        const maybeNow = dateAndTime.format(now, dateTool.DAY_FORMAT);
        assert.equal(true, dateTool.isSameDay(now, dateAndTime.parse(maybeNow, dateTool.DAY_FORMAT)));
        
    });
});

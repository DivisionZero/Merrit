const chai = require('chai');
const expect = require('chai').expect;
const dateAndTime = require('date-and-time');
const dateTool = require('../../src/utils/dateTools');

chai.should();

describe('dateTools', () => {
    it('Test isSameDay()', () => {
        const now = new Date();
        const maybeNow = dateAndTime.format(now, dateTool.DAY_FORMAT);
        dateTool.isSameDay(now, dateAndTime.parse(maybeNow, dateTool.DAY_FORMAT)).should.be.true;

        expect(() => dateTool.isSameDay(new Date(), 'foo')).to.throw();
    });
});

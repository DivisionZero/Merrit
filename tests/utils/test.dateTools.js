const chai = require('chai');
const { expect } = require('chai');
const dateAndTime = require('date-and-time');
const dateTools = require('../../src/utils/dateTools');
const _ = require('underscore');

chai.should();

describe('dateTools', () => {
    it('Test numberToDate', () => {
        const epoch = dateTools.numberToDate(0 + (60000 * (new Date()).getTimezoneOffset()));
        epoch.getYear().should.be.equal(70);
    });
    it('Test stringToDate', () => {
        const now = new Date();
        const strDate = dateAndTime.format(now, dateTools.DAY_FORMAT);
        const convertedDate = dateTools.stringToDate(strDate);

        convertedDate.getYear().should.be.equal(now.getYear());
        convertedDate.getMonth().should.be.equal(now.getMonth());
        convertedDate.getDay().should.be.equal(now.getDay());

        const strDateFull = dateAndTime.format(now, dateTools.MINUTE_FORMAT);
        const convertedFullDate = dateTools.stringToDate(strDateFull);

        convertedFullDate.getYear().should.be.equal(now.getYear());
        convertedFullDate.getMonth().should.be.equal(now.getMonth());
        convertedFullDate.getDay().should.be.equal(now.getDay());
        convertedFullDate.getHours().should.be.equal(now.getHours());
        convertedFullDate.getMinutes().should.be.equal(now.getMinutes());
        convertedFullDate.getSeconds().should.be.equal(now.getSeconds());
    });
    it('Test toDate', () => {
        const now = new Date();
        const unixTs = dateTools.toUnixTimestamp(now);
        dateTools.isSameTime(now, dateTools.toDate(now)).should.be.true;
        dateTools.isSameTime(now, dateTools.toDate(
            dateAndTime.format(now, dateTools.MINUTE_FORMAT))).should.be.true;
        // TODO: Flakey, fix
        //dateTools.isSameTime(now, dateTools.toDate(unixTs)).should.be.true;
        _.isDate(dateTools.toDate(unixTs)).should.be.true;
        
        expect(() => dateTools.toDate(NaN)).to.throw();
        expect(() => dateTools.toDate("foo")).to.throw();
        expect(() => dateTools.toDate("")).to.throw();
        expect(() => dateTools.toDate({})).to.throw();
        expect(() => dateTools.toDate(null)).to.throw();
        expect(() => dateTools.toDate(undefined)).to.throw();
    });
    it('Test isSameDay()', () => {
        const now = new Date();
        const maybeNow = dateAndTime.format(now, dateTools.DAY_FORMAT);
        dateTools.isSameDay(now, dateAndTime.parse(maybeNow, dateTools.DAY_FORMAT)).should.be.true;

        expect(() => dateTools.isSameDay(new Date(), 'foo')).to.throw();
    });
    it('Test isSameTime()', () => {
        const now = new Date();
        const maybeNow = dateAndTime.format(now, dateTools.MINUTE_FORMAT);

        dateTools.isSameTime(now, dateAndTime.parse(maybeNow, dateTools.MINUTE_FORMAT))
            .should.be.true;
        expect(() => dateTools.isSameTime(new Date(), 'foo')).to.throw();
    });
});

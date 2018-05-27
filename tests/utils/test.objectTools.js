const chai = require('chai');
const expect = require('chai').expect;
const {
    get,
    getString,
    getNumber,
    getDate,
} = require('../../src/utils/objectTools');
const date = require('date-and-time');
chai.should();

describe('objectTools', () => {
    it('Test get()', () => {
        expect(() => get({}, 'foo')).to.throw();
        get(undefined, 'foo', 'bar').should.be.equal('bar');
        get({foo: 'bar'}, 'foo').should.be.equal('bar');
        get({ foo: 2 }, 'foo', undefined, n => n * n).should.be.equal(4);
    });
    it('Test getString()', () => {
        getString({ foo: 4 }, 'foo').should.deep.equal('4');
    });
    it('Test getNumber()', () => {
        getNumber({ foo: 4}, 'foo').should.deep.equal(4);
        getNumber({ foo: 4.35 }, 'foo', undefined, 1).should.deep.equal(4.4);
    });
    it('Test getDate()', () => {
        const format = 'YYYY-MM-DD';
        const dateStr = '2018-01-01';
        const dateObj = date.parse(dateStr, format);
        getDate({ date: dateObj }, 'date', null, format).toISOString().should.equal(dateObj.toISOString());
        getDate({ date: dateStr }, 'date', null, format).toISOString().should.equal(dateObj.toISOString());
    });
});

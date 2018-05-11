const assert = require('assert'),
      objectTools = require('../src/utils/objectTools')(),
      get = objectTools.get,
      getString = objectTools.getString,
      getNumber = objectTools.getNumber,
      getDate = objectTools.getDate,
      date = require('date-and-time');

describe('object tools', () => {
    it('verify this works', () => {
        assert.equal(undefined, get({}, 'foo'));
        assert.equal(undefined, get(undefined,'foo'));
        assert.equal('bar', get(undefined, 'foo', 'bar'));
        assert.equal('bar', get({foo: 'bar'}, 'foo'));
        assert.equal(4, get({foo: 2}, 'foo', undefined, function(n){
            return n * n;
        }));
        assert.equal("4", getString({foo: 4}, 'foo'));
        assert.equal(4, getNumber({foo: 4}, 'foo'));
        assert.equal(4.4, getNumber({foo: 4.35}, 'foo', undefined, 1));
        const format = 'YYYY-MM-DD',
              dateStr = '2018-01-01',
              dateObj = date.parse(dateStr, format); 
        assert.equal(dateObj, getDate({'date': dateObj}, 'date', null, format));
        assert.equal(dateObj.toISOString(), getDate({'date': dateStr}, 'date', null, format).toISOString());
    });
});


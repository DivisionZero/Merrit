const chai = require('chai');
const httpTools = require('../../src/utils/httpTools');

chai.should();

describe('httpTools', () => {
    it.only('test buildFullUrl', () => {
        httpTools.buildFullUrl('http://google.com', '/api', { foo: 'bar', faa: 'baz' }).should.equal('http://google.com/api?faa=baz&foo=bar');
        httpTools.buildFullUrl('http://google.com', '/api', 'foo=bar&faa=baz').should.equal('http://google.com/api?foo=bar&faa=baz');
    });
});

var expect = require('chai').expect;

describe('Init', function() {
  it('start a new testing env', function(done) {
    expect('test').to.equal('test');
    done();
  });
});

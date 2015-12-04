var expect = require('chai').expect;
var app = require('../index');
var request = require('supertest');
var User = require('../models/users');

describe('POST /login', function() {


  it('user can login', function(done) {
    request(app)
      .post('/login')
      .send({
        'username': 'test',
        'password': 'test'
      })
      .end(function(err, res) {
        console.log(res);
        expect(res.text).be.json;
        expect(res.statusCode).to.equal(200);
        var fetchedData = JSON.parse(res.text);
        expect(fetchedData).to.be.an('object');
        expect(fetchedData).to.be.not.empty;
        expect(fetchedData).to.have.property('token');
        done();
      });
  });
});

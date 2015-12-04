var expect = require('chai').expect;
var app = require('../index');
var request = require('supertest');
var User = require('../models/users');

describe('POST /register', function() {
  it('user can register', function(done) {
    User.findOne({
      username: 'test'
    }, function(err, doc) {
      doc.remove().then(function(removed) {
        return res.status(200).send(removed);
      });
    });

    request(app)
      .post('/register')
      .send({
        'username': 'test',
        'password': 'test'
      })
      .end(function(err, res) {
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

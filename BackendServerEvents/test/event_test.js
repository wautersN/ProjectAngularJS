var expect = require('chai').expect;
var app = require('../index');
var request = require('supertest');
var agent = request.agent(app);


describe('GET /events', function() {
  it('should respond with 200 in case of valid request', function(done) {
    request(app)
      .get('/events')
      .send()
      .end(function(err, res) {
        console.log(err);
        if (err) {
          return done(err);
        }
        var fetchedData = JSON.parse(res.text);
        expect(fetchedData).to.be.an('array');
        expect(fetchedData).to.be.not.empty;
        var event = fetchedData[0];

        if (event) {
          expect(event).to.have.all.keys('__v', '_id', 'artists', 'date', 'location', 'rating', 'name');
          expect(event.artists).to.be.an('array');
          expect(event.rating).to.be.a('number');
          done();
        }

      });
  });
});

'use strict';

var app = require('../..');
import request from 'supertest';

describe('Genre API:', function() {
  describe('GET /api/genres', function() {
    var genres;

    beforeEach(function(done) {
      request(app)
        .get('/api/genres')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          genres = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(genres).to.be.instanceOf(Array);
    });
  });
});

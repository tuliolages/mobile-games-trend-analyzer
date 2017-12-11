'use strict';

var app = require('../..');
import request from 'supertest';

var newPlacement;

describe('Placement API:', function() {
  describe('GET /api/placements', function() {
    var placements;

    beforeEach(function(done) {
      request(app)
        .get('/api/placements')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          placements = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(placements).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/placements', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/placements')
        .send({
          name: 'New Placement',
          info: 'This is the brand new placement!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newPlacement = res.body;
          done();
        });
    });

    it('should respond with the newly created placement', function() {
      expect(newPlacement.name).to.equal('New Placement');
      expect(newPlacement.info).to.equal('This is the brand new placement!!!');
    });
  });

  describe('GET /api/placements/:id', function() {
    var placement;

    beforeEach(function(done) {
      request(app)
        .get(`/api/placements/${newPlacement._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          placement = res.body;
          done();
        });
    });

    afterEach(function() {
      placement = {};
    });

    it('should respond with the requested placement', function() {
      expect(placement.name).to.equal('New Placement');
      expect(placement.info).to.equal('This is the brand new placement!!!');
    });
  });

  describe('PUT /api/placements/:id', function() {
    var updatedPlacement;

    beforeEach(function(done) {
      request(app)
        .put(`/api/placements/${newPlacement._id}`)
        .send({
          name: 'Updated Placement',
          info: 'This is the updated placement!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedPlacement = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPlacement = {};
    });

    it('should respond with the updated placement', function() {
      expect(updatedPlacement.name).to.equal('Updated Placement');
      expect(updatedPlacement.info).to.equal('This is the updated placement!!!');
    });

    it('should respond with the updated placement on a subsequent GET', function(done) {
      request(app)
        .get(`/api/placements/${newPlacement._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let placement = res.body;

          expect(placement.name).to.equal('Updated Placement');
          expect(placement.info).to.equal('This is the updated placement!!!');

          done();
        });
    });
  });

  describe('PATCH /api/placements/:id', function() {
    var patchedPlacement;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/placements/${newPlacement._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Placement' },
          { op: 'replace', path: '/info', value: 'This is the patched placement!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedPlacement = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedPlacement = {};
    });

    it('should respond with the patched placement', function() {
      expect(patchedPlacement.name).to.equal('Patched Placement');
      expect(patchedPlacement.info).to.equal('This is the patched placement!!!');
    });
  });

  describe('DELETE /api/placements/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/placements/${newPlacement._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when placement does not exist', function(done) {
      request(app)
        .delete(`/api/placements/${newPlacement._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});

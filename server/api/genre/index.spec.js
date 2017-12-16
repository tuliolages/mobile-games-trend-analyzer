'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var genreCtrlStub = {
  index: 'genreCtrl.index'
};

var routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
var genreIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './genre.controller': genreCtrlStub
});

describe('Genre API Router:', function() {
  it('should return an express router instance', function() {
    expect(genreIndex).to.equal(routerStub);
  });

  describe('GET /api/genres', function() {
    it('should route to genre.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'genreCtrl.index')
        ).to.have.been.calledOnce;
    });
  });
});

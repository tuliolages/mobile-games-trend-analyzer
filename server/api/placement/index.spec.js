'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var placementCtrlStub = {
  index: 'placementCtrl.index',
  show: 'placementCtrl.show',
  create: 'placementCtrl.create'
};

var routerStub = {
  get: sinon.spy(),
  post: sinon.spy()
};

// require the index with our stubbed out modules
var placementIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './placement.controller': placementCtrlStub
});

describe('Placement API Router:', function() {
  it('should return an express router instance', function() {
    expect(placementIndex).to.equal(routerStub);
  });

  describe('GET /api/placements', function() {
    it('should route to placement.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'placementCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/placements/:id', function() {
    it('should route to placement.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'placementCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/placements', function() {
    it('should route to placement.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'placementCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/placements/:id', function() {
    it('should route to placement.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'placementCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/placements/:id', function() {
    it('should route to placement.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'placementCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/placements/:id', function() {
    it('should route to placement.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'placementCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});

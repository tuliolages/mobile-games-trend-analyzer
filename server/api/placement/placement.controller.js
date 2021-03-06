/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/games/:id/placements    ->  show
 * GET     /api/genres/:id/placements   ->  showGenre
 */

'use strict';

import { applyPatch } from 'fast-json-patch';
import Sequelize from 'sequelize';

import {Placement, Game} from '../../sqldb';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      applyPatch(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.destroy()
        .then(() => res.status(204).end());
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Placements
export function index(req, res) {
  return Placement.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Placement from the DB
export function show(req, res) {
  return Placement.findAll({
    where: {
      game_id: req.params.id,
      date: {
        between: [req.query.start_date, req.query.end_date]
      }
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Placement from the DB
export function showGenre(req, res) {
  return Placement.findAll({
    include: [{
      model: Game,
      where: { genre_id: req.params.id }
    }],
    where: {
      date: {
        between: [req.query.start_date, req.query.end_date]
      }
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Placement in the DB
export function create(req, res) {
  return Placement.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Placement in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }

  return Placement.upsert(req.body, {
    where: {
      _id: req.params.id
    }
  })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Placement in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Placement.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Placement from the DB
export function destroy(req, res) {
  return Placement.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

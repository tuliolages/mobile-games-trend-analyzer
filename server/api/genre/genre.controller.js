/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/genres              ->  index
 */

'use strict';

import {Genre} from '../../sqldb';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Genres
export function index(req, res) {
  return Genre.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}
/**
 * Sequelize initialization module
 */

'use strict';

import path from 'path';
import config from '../config/environment';
import Sequelize from 'sequelize';

var db = {
    Sequelize,
    sequelize: new Sequelize(config.sequelize.uri, config.sequelize.options)
};

// Insert models below
db.Genre = db.sequelize.import('../api/genre/genre.model');
db.Game = db.sequelize.import('../api/game/game.model');
db.Placement = db.sequelize.import('../api/placement/placement.model');
db.Thing = db.sequelize.import('../api/thing/thing.model');

Object.keys(db).forEach(modelName => {
    if('classMethods' in db[modelName].options) {
        if('associate' in db[modelName].options['classMethods']) {
            db[modelName].options.classMethods.associate(db);
        }
    }
});

module.exports = db;

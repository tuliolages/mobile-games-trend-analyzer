/**
 * Main application file
 */

'use strict';

import express from 'express';
import sqldb from './sqldb';
import config from './config/environment';
import http from 'http';

import expressConfig from './config/express';
import registerRoutes from './routes';
import { addEntries } from './api/placement/placement.controller';

var schedule = require('node-schedule');
var gplay = require('google-play-scraper');

// Populate databases with sample data
if(config.seedDB) {
  require('./config/seed');
}

// Setup server
var app = express();
var server = http.createServer(app);

expressConfig(app);
registerRoutes(app);

// Start server
function startServer() {
  app.angularFullstack = server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}

function startDailyUpdateJob() {
  schedule.scheduleJob('* * * 1 * *', function(){
    gplay.list({
      category: gplay.category.GAME,
      collection: gplay.collection.TOP_FREE,
      num: 100
    })
    .then((list) => {
      let now = new Date();
      now.setHours(0, 0, 0, 0);

      addEntries([{date: now, gameEntries: list}])
          .then(res => console.log(res))
          .catch(err => console.error(err));
      });
  });
}

sqldb.sequelize.sync()

  .then(startServer)
  .then(startDailyUpdateJob)
  .catch(err => {
    console.log('Server failed to start due to error: %s', err);
  });

// Expose app
exports = module.exports = app;

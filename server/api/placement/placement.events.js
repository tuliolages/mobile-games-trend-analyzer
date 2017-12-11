/**
 * Placement model events
 */

'use strict';

import {EventEmitter} from 'events';
var Placement = require('../../sqldb').Placement;
var PlacementEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
PlacementEvents.setMaxListeners(0);

// Model events
var events = {
  afterCreate: 'save',
  afterUpdate: 'save',
  afterDestroy: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Placement) {
  for(var e in events) {
    let event = events[e];
    Placement.hook(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc, options, done) {
    PlacementEvents.emit(event + ':' + doc._id, doc);
    PlacementEvents.emit(event, doc);
    done(null);
  };
}

registerEvents(Placement);
export default PlacementEvents;

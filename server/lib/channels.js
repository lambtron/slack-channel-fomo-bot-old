
/**
 * Module dependencies.
 */

var db = require('./db');
var wrap = require('co-monk');
var Channel = wrap(db.get('channel'));

/**
 * Expose `Channel`.
 */

module.exports = Channel;

/**
 * Replace channel in db.
 */

Channel.replace = function *(channel) {
  yield this.remove({});
  return yield this.insert(channel);
};

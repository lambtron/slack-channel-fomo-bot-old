
/**
 * Module dependencies.
 */

var mongo = process.env.MONGOLAB_URI || 'mongodb://localhost/segment-slack-channels';
var monk = require('monk');

/**
 * Expose `db`.
 */

module.exports = monk(mongo);

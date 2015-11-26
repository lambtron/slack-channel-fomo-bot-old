
/**
 * Module dependencies.
 */

var slack = require('./lib/slack');
var co = require('co');

/**
 * Main function.
 */

module.exports = function *() {
  var newChannels = yield slack.channels();
  return yield slack.post(newChannels);
};

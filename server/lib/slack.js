
/**
 * Module dependencies.
 */

var post = require('./request.js').post;
var get = require('./request.js').get;
var Channel = require('./channels');
var fmt = require('node-fmt');
var _ = require('lodash');

/**
 * Const.
 */

var uri = 'https://slack.com/api/channels.list?token=' + process.env.SLACK_TOKEN + '&exclude_archived=1&pretty=1';
var webhook = process.env.SLACK_WEBHOOK;

/**
 * Get Slack channels.
 */

exports.channels = function *() {
  var res = yield get(uri);
  var allChannels = res.body.channels;
  var oldChannels = yield Channel.find({});
  yield Channel.replace(allChannels);
  return diff(allChannels, oldChannels);
};

/**
 * Post in Slack.
 */

exports.post = function *(channels) {
  var text = '';
  for (var i = 0; i < channels.length; i++) {
    text += print(channels[i]);
  }
  return yield post(webhook, fmtSlack(text));
}

/**
 * Helper function to format activity to how slack wants it.
 */

function fmtSlack(msg) {
  return JSON.stringify({
    username: 'Channel FOMO Bot',
    text: msg,
    icon_url: 'http://i.imgur.com/fPEYTEl.png'
  });
}

/**
 * Print channel.
 */

function print(channel) {
  var str = '\n';
  str += fmt('<#%s>', channel.id) + '\n';
  str += fmt('  Created by <@%s>', channel.creator) + '\n';
  if (channel.purpose.value) str += fmt('  Purpose: %s\n', channel.purpose.value);
  if (channel.topic.value) str += fmt('  Topic: %s\n', channel.topic.value);
  str += '\n';
  return str;
}

/**
 * Return the difference of two arrays with `id`.
 */

function diff(a, b) {
  var bIds = {}
  b.forEach(function(obj){
    bIds[obj.id] = obj;
  });
  return a.filter(function(obj){
    return !(obj.id in bIds);
  });
}

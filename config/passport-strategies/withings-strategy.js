'use strict';
var WithingsStrategy = require('passport-withings').Strategy;
var User = require('../../app/models/user');
var Channel = require('../../app/models/channel');
var textCrypt = require('../../app/lib/textCrypt');

var CONFIG = Channel.syncFindOauthConfigByType('channel:withings');

CONFIG.passReqToCallback = true;

var withingsStrategy = new WithingsStrategy(CONFIG, function(req, token, tokenSecret, profile, done) {

  User.addApiAuthorization(req.user, 'channel:withings', {
    authtype: 'oauth',
    token_crypt: textCrypt.encrypt(token)
  }).then(function() {
    done(null, req.user);
  }).catch(function(error) {
    done(error);
  });
});

module.exports = withingsStrategy;

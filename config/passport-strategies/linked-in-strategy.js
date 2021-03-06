'use strict';
var LinkedinController = require('passport-linkedin-oauth2').Strategy;
var User               = require('../../app/models/user');
var Channel            = require('../../app/models/channel');
var textCrypt          = require('../../app/lib/textCrypt');

var CONFIG = Channel.syncFindOauthConfigByType('channel:linked-in');

CONFIG.passReqToCallback = true;

var linkedinStrategy = new LinkedinController(CONFIG, function(req, accessToken, refreshToken, profile, done){

  User.addApiAuthorization(req.user, 'channel:linked-in', {authtype: 'oauth', token_crypt: textCrypt.encrypt(accessToken)}).then(function () {
    done(null, req.user);
  }).catch(function(error){
    done(error);
  });
});

module.exports = linkedinStrategy;

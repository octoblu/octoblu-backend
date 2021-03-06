var request = require('request');
var Channel = require('../models/channel');
var User = require('../models/user');
var textCrypt = require('../lib/textCrypt');

var channelId = '54468c4914d3e4c4645c6e27';
var CONFIG = Channel.syncFindOauthConfigByType('channel:gotomeeting-free');

var concatAuth = encodeURIComponent(CONFIG.clientID) + ':' + encodeURIComponent(CONFIG.clientSecret);
var authStr = new Buffer(concatAuth).toString('base64');

var GotoMeetingFreeController = function(){
  this.authorize = function(req, res, next){
    var reqOptions = {
      url : 'https://free.gotomeeting.com/api/oauth/token',
      method : 'POST',
      headers : {
        'Authorization' : 'Basic ' + authStr
      },
      form : {
        grant_type : 'client_credentials'
      },
    };
    request(reqOptions, function(error, response, body){
      var json;
      if(error || !body){
        res.redirect('/home');
      }else{
        try{
          json = JSON.parse(body);
        }catch(e){ console.log('Error parsing', e); }
        User.overwriteOrAddApiByChannelId(req.user, channelId, {authtype: 'oauth', token_crypt: textCrypt.encrypt(json.access_token)});
        User.update({_id: req.user._id}, req.user).then(function(){
          next();
        }).catch(function(error){
          next(error);
        });
      }
    });
  };
  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=GoToMeetingFree');
  };
};

module.exports = GotoMeetingFreeController;

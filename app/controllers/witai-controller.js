var Channel   = require('../models/channel');
var User      = require('../models/user');
var textCrypt = require('../lib/textCrypt');

function WitaiController(){
  this.authorize = function(req, res){
    var channelId = req.params.id;
    var channelData = { authtype : 'oauth', token : req.body.accessToken};
    User.addApiAuthorization(req.user, 'channel:witai', channelData).then(function(){
        res.send(201);
      }).catch(function(error){
        console.error(error.stack);
        res.send(422);
      });
  };

  this.redirectToConfigure = function(req, res){
    res.redirect('/configure?added=Wit.ai');
  };
}

module.exports = WitaiController;

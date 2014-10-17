var passport = require('passport');

var SmartsheetController = function(){
  this.authorize = passport.authenticate('smartsheet');
  this.callback  = passport.authenticate('smartsheet', { failureRedirect: '/home' });
  this.redirectToDesigner = function(req, res){
    res.redirect('/design');
  };
};

module.exports = SmartsheetController;
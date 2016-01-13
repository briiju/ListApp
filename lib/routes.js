// routes.js
// provides routes for navigation/login
'use strict';

var path             = require( 'path' );
var auth             = require( './auth' );

module.exports = function(app, passport) {
  app.get('/', function(req, res) {
    //console.log('sending user: ' + req.user);
    res.render('index.html', { user: req.user });
  });

  app.get('/test', function(req, res) {
    console.log('sending user: ' + req.user);
    res.send(req.isAuthenticated() ? req.user : '0');
  });

  app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  app.get( '/auth/google/callback',
  	passport.authenticate( 'google', {
  		successRedirect: 'http://www.eggplantmovies.com/#/overview',
  		failureRedirect: 'http://www.eggplantmovies.com/#/login'
    }
  ));

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  app.get('/loggedin', function(req, res) {
    console.log('1: user ' + req.user + ' is opening a login restricted page');
    if(req.isAuthenticated()) {
      console.log('2: user is authenticated');
      res.send(req.user);
    } else {
      console.log('2: user is not authenticated');
      res.send('0');
    }
    //res.send(req.isAuthenticated() ? req.user : '0');
  });
}

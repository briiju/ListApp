// passport.js
// configures passport for logins
'use strict';

var GoogleStrategy   = require( 'passport-google-oauth' ).OAuth2Strategy;
var User             = require( '../models/user' );
var configAuth       = require( './gAuth.js' );

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  passport.use(new GoogleStrategy({
      clientID:     configAuth.GOOGLE_CLIENT_ID,
      clientSecret: configAuth.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://www.eggplantmovies.com/auth/google/callback",
      passReqToCallback: true
    },
    function(request, accessToken, refreshToken, profile, done) {
      // asynchronous verification, for effect...
      //console.log(accessToken);
      //console.log(refreshToken);
      process.nextTick(function () {
        User.findOne({'id': profile.id}, function(err, user) {
          //console.log(user);
          //console.log(profile);
          if (err) {
            console.log('found an error while logging in');
            return done(err);
          }
          if (user) {
            console.log(profile.displayName + '(' + profile.emails[0].value + ') has logged in');
            //console.log(accessToken);
            user.id = profile.id;
            user.accessToken = accessToken;
            user.save(function(err) {
              if (err) return handleError(err);
            });
            return done(null, user);
          } else {
            console.log(profile.displayName + ' (' + profile.emails + ') has tried to log in, but there is no saved user for them');
            return done(null, null);
          }
        })
      });
    }
  ));
}

// socket.js
// holds functions for sending/getting data
'use strict';


var Movie            = require( '../models/movie.js' );
var moment           = require( 'moment' );

module.exports = function(http) {
  var io             = require( 'socket.io' )(http);
  //socket functions
  io.on('connection', function(socket){
    //Log when a client connects and send them the movie list
    console.log('user opened movie-list');

    //send movie to client(s)
    var sendthemovies = function (target) {
      Movie.find(function (err, movies) {
        //console.log('sending movie list, target: ' + target);
        var movielist = JSON.stringify(movies);
        movielist = JSON.parse(movielist);
        if (target == 'socket'){
          //console.log('sending movies over socket');
          socket.emit('sendingmovielist', movielist);
        } else if (target == 'io') {
          //console.log('sending movies over io');
          io.sockets.emit('sendingmovielist', movielist);
        }
      })
    };

    //save movie from client
    socket.on('sendmovie', function(data){
      var newmoviename = data.movieName;
      var newaddedby = data.addedBy;
      //save the movie
      var newMovie = Movie({
        movieName    : newmoviename,
        addedBy      : newaddedby,
        addedOn      : moment(),
        watched      : false,
        watchedOn    : moment()
      })
      newMovie.save(function(err) {
        if (err) console.log(err);
        console.log('movie saved!')
      })
      //send the movie list
      sendthemovies('io');
    });

    //client is requesting movie list
    socket.on('requestmovies', function(data) {
      sendthemovies('io');
    });
  });
}

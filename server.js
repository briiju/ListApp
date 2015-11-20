/*
    Dependencies
*/
var express          = require( 'express' )
var app              = express()
var http             = require( 'http' ).Server(app);
//var passport         = require( 'passport' )
var util             = require( 'util' )
var bodyParser       = require( 'body-parser' )
//var cookieParser     = require( 'cookie-parser' )
//var session          = require( 'express-session' )
//var RedisStore       = require( 'connect-redis' )( session )
//var GoogleStrategy   = require( 'passport-google-oauth2' ).Strategy;
var io               = require( 'socket.io' )(http);
var movieDB          = require( 'mongoose' );
//var User             = require( './user' );
var Movie            = require( './models/movie' );
var moment           = require( 'moment' );

/*
    Configure
*/

//connect mongoose database
movieDB.connect('mongodb://localhost/movies')

// configure Express
app.use( express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('index.html');
});

//use REST to  serve mongodb info
/*
app.get('/movie-list', function(req, res) {
  Movie.find(function (err, movies) {
    if (err) {
      res.send(err);
    }
    res.json(movies);
  });
})
*/

//socket functions
io.on('connection', function(socket){
  //Log when a client connects and send them the movie list
  console.log('user opened movie-list');

  sendthemovies = function (target) {
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
  sendthemovies('socket');
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
});

/*
    Start server
*/

http.listen(3000, function(){
  console.log('listening on *:3000');
});

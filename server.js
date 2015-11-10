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

movieDB.connect('mongodb://localhost/ListApp')

// configure Express
app.use( express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('index.html');
});

app.get('/movie-list', function(req, res) {
  Movie.find(function (err, movies) {
    if (err) {
      res.send(err);
    }
    res.json(movies);
  });
})

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
  //When the user connects, ask for their name
  console.log('user opened page')
  //When the user presses send, send their message
  socket.on('save movie', function(moviename){
    io.emit('save entry', moviename);
  });
});

/* Dependencies */

var express          = require( 'express' )
var app              = express()
var http             = require( 'http' ).Server(app);
var passport         = require( 'passport' )
var util             = require( 'util' )
var bodyParser       = require( 'body-parser' )
var cookieParser     = require( 'cookie-parser' )
var session          = require( 'express-session' )
var RedisStore       = require( 'connect-redis' )( session )
var movieDB          = require( 'mongoose' );

/* Configure */

//connect mongoose database
movieDB.connect('mongodb://localhost/movies')

// configure passport
var pass             = require( './lib/passport.js' )(passport);

// configure Express
app.use( express.static(__dirname + '/public'));
app.use( cookieParser());
app.use( bodyParser.json());
app.use( bodyParser.urlencoded({
	extended: true
}));
app.use( session({
	secret: 'cookie_secret',
	name:   'kaas',
	store:  new RedisStore({
		host: '127.0.0.1',
		port: 6379
	}),
	proxy:  true,
  resave: true,
  saveUninitialized: true
}));
app.use( passport.initialize());
app.use( passport.session());

// get routes
require( './lib/routes.js' )(app, passport);

// get socket functions
var socket           = require('./lib/socket.js')(http);

/* Start server */
http.listen(3000, function(){
  console.log('listening on *:3000');
});

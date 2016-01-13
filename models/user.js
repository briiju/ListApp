var mongoose         = require( 'mongoose' );

// define the schema for our movie model
var userSchema = mongoose.Schema({

        accessToken  : String,
        id           : String,
        email        : String,
        name         : String,
        displayName  : String

});

var User = mongoose.model('User', userSchema);

// expose the movie model
module.exports = User;

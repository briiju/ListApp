var mongoose         = require( 'mongoose' );

// define the schema for our movie model
var movieSchema = mongoose.Schema({

        movieName    : String,
        addedBy      : String,
        addedOn      : { type: Date, default: Date.now },
        watched      : { type: Boolean, default: false },
        watchedOn    : Date

});

var Movie = mongoose.model('Movie', movieSchema);

// expose the movie model
module.exports = Movie;

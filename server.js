// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');
var Hashids = require('hashids');
var hashids = new Hashids('', 8);

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; // set our port

var mongoose   = require('mongoose');
var Playlist     = require('./app/models/playlist');


// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// on routes that end in /playlists
// ----------------------------------------------------
router.route('/playlists')

  // get all the playlists (accessed at GET http://localhost:8080/playlists)
  .get(function(req, res) {
    Playlist.
      find().
      limit(10).
      exec(function(err, playlists) {
    	if (err) {res.send(err);}
    	res.json(playlists);
    });
  })

  // create a playlist (accessed at POST http://localhost:8080/playlists)
  .post(function(req, res) {
    var playlist = new Playlist(); // create a new instance of the Playlist model
    playlist.playlist_json = req.body; // set the playlist's name (comes from the request)
    
    playlist.save(function(err) {
    	if (err) { res.send(err); }
    	res.json({ 'collection_id': hashids.encode(playlist._id) });
    });
  })

// on routes that end in /playlists/:playlist_id
// ----------------------------------------------------
router.route('/playlists/:playlist_id')

// get the bear with that id
.get(function(req, res) {

  // returns a one-object length array
  // need to grab the first object
  var decoded_id = hashids.decode(req.params.playlist_id)[0]
  
  Playlist.findById(decoded_id, function(err, playlist) {
    if (err) {res.send(err);}
    if (!playlist) { 
      msg = {"error": "This hash doesn't exist in the database"}
      res.status(404).json(msg);
    }
    else {
      res.json(playlist.playlist_json);
    }
  });
})


// REGISTER OUR ROUTES -------------------------------
app.use('/', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

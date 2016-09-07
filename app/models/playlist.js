
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');
 
var connection = mongoose.connect('mongodb://localhost:27017/crossfade'); // connect to our database

autoIncrement.initialize(connection);
 
var PlaylistSchema = new Schema({
	playlist_json: JSON
});
 
PlaylistSchema.plugin(autoIncrement.plugin, 'playlists');

module.exports = mongoose.model('Playlist', PlaylistSchema);

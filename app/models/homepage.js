var mongoose = require('mongoose');

// Create Homepage Schema (for adding pictures to home page slideshow)

var homepagePhotoSchema = new mongoose.Schema({
  url: {type: String, default: ""}
});

module.exports = mongoose.model("HomepagePhoto", homepagePhotoSchema);

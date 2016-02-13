var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
  title: String,
  created_at: {type: Date, default: Date.now},
  text: String
});

module.exports = mongoose.model("Post", postSchema);

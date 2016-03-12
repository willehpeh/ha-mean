var mongoose = require('mongoose');

// Create User Schema

var userSchema = new mongoose.Schema({
  name: String,
  password: String
});

module.exports = mongoose.model("User", userSchema);

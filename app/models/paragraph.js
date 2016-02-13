var mongoose = require('mongoose');

var paragraphSchema = new mongoose.Schema({
  contents: String
});

module.exports = mongoose.model("Paragraph", paragraphSchema);

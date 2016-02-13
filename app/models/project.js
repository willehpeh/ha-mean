var mongoose = require('mongoose');

var projectSchema = new mongoose.Schema({
    name : {type : String, default: ''},
    family : {type : String, default: ''},
    description : {type : String, default: ''},
    reference : {type : String, default: ''},
    partner : {type : String, default: ''},
    created_at : {type : Date, default: Date.now},
    photos : [],
    news : {type : Boolean, default: false},
    front_page : {type : Boolean, default: false},
    front_page_order : {type : Number, default: 0},
    date_started : {type: String, default: ''},
    date_completed : {type: String, default: ''}
});

module.exports = mongoose.model("Project", projectSchema);

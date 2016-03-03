var mongoose = require('mongoose');

var projectSchema = new mongoose.Schema({
    created_at : {type : Date, default: Date.now},
    name : {type : String, default: ''},
    address : {type : String, default: ''},
    surface : {type : String, default: ''},
    client : {type : String, default: ''},
    status : {type : String, default: ''},
    year : {type : String, default: ''},
    description : {type : String, default: ''},
    characteristics : {type: String, default: ''},
    photos : [],
    front_page : {type : Boolean, default: false},
    family : {type : String, default: ''}
});

module.exports = mongoose.model("Project", projectSchema);

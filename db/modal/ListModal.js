// JavaScript source code
const mongoose = require("mongoose");

const listSchema = {
    movieid: {
        type: String,
        require: true
    },
    userid:{
        type: String,
        require: true
    }
};

const List = mongoose.model('List', listSchema);
module.exports = List;

// JavaScript source code
const mongoose = require("mongoose");

const userSchema = {
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
    
};

const User = mongoose.model('User', userSchema);
module.exports = User;

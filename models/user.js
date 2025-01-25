const { string, required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

// This plugin automatically add hashing,
// salting, username & Password in DataBase
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
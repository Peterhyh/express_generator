const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;


//Mongoose Population: Updating schema-------------------------------------------------------------START
// Added 'firstname' and 'lastname' to use mongo population to pull information from user documents and populate comments subdocuments.
// Next, go to campsite.js file  
const userSchema = new Schema({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    admin: {
        type: Boolean,
        default: false
    }
});
//Mongoose Population: Updating schema-------------------------------------------------------------END


userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
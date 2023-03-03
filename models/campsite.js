
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
//Mongoose Population: Updating schema-------------------------------------------------------------START
//Changing author.type into 'mongoose.Schema.Types.ObjectId' to store reference to user document through the user documents object ID.
//Replace the bottom property with "ref: 'User'" to hold the name of the model for that document.
//documents storing comments about a campsite
const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, {
    timestamps: true
});
//Mongoose Population: Updating schema-------------------------------------------------------------END

const campsiteSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    elevation: {
        type: Number,
        required: true
    },
    cost: {
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    //adding subdocument inside the campsite schema 
    //this will cause every campsite document to be able to contain multiple comment documents stored within an array
    comments: [commentSchema]
}, {
    timestamps: true
});



const Campsite = mongoose.model('Campsite', campsiteSchema)

module.exports = Campsite;



const mongoose = require('mongoose');

// ***** Build Your Model Log Schema here *****
const eventSchema = mongoose.Schema({
    username: {type: String, required: true},
    action: {type: String, required: true},
    time : { type : Date, default: Date.now },
    room: {type: String, required: true},
})

module.exports = mongoose.model('Event', eventSchema);
const mongoose = require('mongoose');

let Schema  = mongoose.Schema;

const registrationSchema = new Schema({
    name: String,
    phonenumber: String,
    registrationDate: Date
})

mongoose.model('registration', registrationSchema)
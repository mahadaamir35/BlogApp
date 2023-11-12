const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')


const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }, 
    isAdmin: {
        type: Boolean, 
        default: false
    }
})
UserSchema.plugin(passportLocalMongoose)

const User = mongoose.model('User', UserSchema)
module.exports = User
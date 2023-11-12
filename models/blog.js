const mongoose = require('mongoose')
const Review = require('./review')

const BlogSchema = new mongoose.Schema({
title: {
    type: String
},
text: {
    type: String  
},
date: {
    type: Date,
    default: Date.now()
}, 
author: {
type: mongoose.Schema.Types.ObjectId, 
ref: 'User'
},

reviews: [
    {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Review'
    }
],

isDisabled: {
    type: Boolean, 
    default : false
}
})


BlogSchema.post('findOneAndDelete', async function (doc) {
   if(doc) {
    await Review.deleteMany({_id: {$in: doc.reviews}})
   }
})


const Blog = mongoose.model('Blog', BlogSchema)
module.exports = Blog
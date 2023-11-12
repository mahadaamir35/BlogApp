const express = require('express')
const router = express.Router({mergeParams: true})
const Review = require('../models/review')
const Blog = require('../models/blog')
const Joi = require('joi')



//middleware for validating reviews
const validateReview = function (req,res,next) {
    const reviewSchema = Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    })
    let result = reviewSchema.validate(req.body)
    if(result.error) {
        throw new Error()
    }
    else {
        next()
    }
}


//middleware for ensuring user is logged in
const isLoggedIn = function (req,res,next) {
    if(!req.isAuthenticated()) {
        req.flash('error', 'you must be signed in!')
       return res.status(400).redirect('/login')
    }
    next()
}






//creating a review
router.post('/',isLoggedIn, validateReview,async (req,res,next) => {
    try {
        const blog = await Blog.findById(req.params.id)
const review = new Review({rating: req.body.rating, comment: req.body.comment})
   review.author = req.user._id
blog.reviews.push(review)  
    await review.save()
    await blog.save()
    req.flash('success', 'Successfully created the review!')
res.status(201).redirect(`/blogs/${blog._id}`)
}
    catch (e) {
next(e)
    }
})



//deleting a review
router.delete('/:reviewId', isLoggedIn,async (req,res,next) => {
    try {
        const review = await Review.findById(req.params.reviewId)
        if(!review.author.equals(req.user._id)) {
           req.flash('error', 'You do not have permission to do that!')
          return res.status(403).redirect(`/blogs/${req.params.id}`) 
        }
     const blog=  await  Blog.findByIdAndUpdate(req.params.id, {$pull: {reviews: req.params.reviewId}}, {new: true})
await Review.findByIdAndDelete(req.params.reviewId)
req.flash('success', 'Successfully deleted the review!')
res.status(204).redirect(`/blogs/${req.params.id}`)
    }
    catch(e) {
next(e)
    }
})




module.exports = router
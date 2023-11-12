const express = require('express')
const app = express()
app.use(express.urlencoded({extended: true}))
const router = express.Router()
const Blog = require('../models/blog')
const Joi = require('joi')



//middleware for validating reviews
const validateBlog = function (req,res,next) {
    const blogSchema = Joi.object({
        title: Joi.string().required(),
        text: Joi.string().required()
    })
   let result =  blogSchema.validate(req.body)
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
        req.session.returnTo = req.originalUrl
        req.flash('error', 'you must be signed in!')
       return res.status(400).redirect('/login')
    }
    next()
}


// const storeReturnTo = function (req,res,next) {
//     if(req.session.returnTo) {
//         res.locals.returnTo = req.session.returnTo
//     }
//     next()
// }



//creating a blog
router.get('/new', isLoggedIn, (req,res) => {
    
    res.status(200).render('blogs/newBlog')
    })
    
    router.post('/',isLoggedIn,validateBlog, async (req,res,next) => {
        try {
            const blog = new Blog({title: req.body.title, text: req.body.text})
    blog.author = req.user._id
            await blog.save()
    req.flash('success', 'Successfully created a blog!')
    res.status(201).redirect(`/blogs/${blog._id}`)
        }
        catch(e) {
next(e)
        }
    })




//getting one blog
router.get('/:id', async (req,res,next) => {
   try {
    


    const blog = await Blog.findById(req.params.id).populate({path: 'reviews', populate: {path: 'author'}}).populate('author')  
    res.status(200).render('blogs/oneBlog', {blog})
   }
   catch (e) {
next(e)
   }
})



//getting all blogs
router.get('/', async (req,res,next) => {
    try {
        
    const blogs = await Blog.find({}).populate('author').populate('reviews')
    res.status(200).render('blogs/allBlogs', {blogs})

    }
    catch (e) {
        next(e)
    }
})






//updating a blog
router.get('/:id/edit' ,isLoggedIn, async (req,res,next) => {
   try {
    
    const blog = await Blog.findById(req.params.id)
    if(!blog.author.equals(req.user._id)) {
req.flash('error', 'You do not have permission to do that!')
return res.status(403).redirect(`/blogs/${req.params.id}`)
    }
    res.status(200).render('blogs/editBlog', {blog})
   }
   catch (e) {
next(e)
   }
})




router.put('/:id',isLoggedIn,validateBlog, async (req,res,next) => {
    try {
    
        const blog  = await Blog.findById(req.params.id)
   if(!blog.author.equals(req.user._id)){
    req.flash('error', 'You do not have permission to do that')
    return res.status(403).redirect(`/blogs/${req.params.id}`)
   }
           const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, {title: req.body.title, text: req.body.text }, {new: true})
        req.flash('success', 'Successfully updated the blog!')
        res.status(201).redirect(`/blogs/${updatedBlog._id}`)
    }
    catch (e) {
next(e)
    }
})



//deleting a blog
router.delete('/:id', isLoggedIn,async (req,res,next) => {
   try {
    const blog = await Blog.findById(req.params.id)
    if(!blog.author.equals(req.user._id)) {
req.flash('error', 'You do not have permission to do that!')
return res.status(403).redirect(`/blogs/${req.params.id}`)
    }
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id)
    req.flash('success', 'Successfully deleted the blog!')
    res.status(204).redirect('/blogs')
   }
   catch (e) {
next(e)
   }
})


module.exports = router;
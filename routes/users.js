const express = require('express')
const User = require('../models/user')
const router = express.Router()
const passport  = require('passport')


//middleware for ensuring user is logged in
const isLoggedIn = function (req,res,next) {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'you must be signed in!')
       return res.status(400).redirect('/blogs')
    }
    next()
}


//middleware that stores the redirect path on res.locals
const storeReturnTo = function (req,res,next) {
    if(req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo
    }
    next()
}


//getting register form
router.get('/register', (req,res) => {
    res.status(200).render('users/registerForm')
})


//registering a user
router.post('/register' , async (req,res,next) => {
    try {
    const user = new User({email: req.body.email, username: req.body.username})
    const registeredUser = await User.register(user, req.body.password)
req.login(registeredUser, (err) => {
if(err) return next(err)
req.flash('success', 'Welcome to BlogApp')
    res.status(201).redirect('/blogs')
})
    
    }
    catch(e) {
        req.flash('error', e.message)
        res.status(400).redirect('/register')
    }
})


//getting login form
router.get('/login',  (req,res) => {
    res.status(200).render('users/loginForm')
})



//logging in the user
router.post('/login', storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), async (req,res,next) => {
   try {
    req.flash('success', 'Welcome back!')
    const redirectUrl = res.locals.returnTo || '/blogs'
delete req.session.returnTo
    res.status(200).redirect(redirectUrl)

   }
   catch(e) {
    
    next(e)
   }
})



//logging the user out
router.get('/logout',(req, res, next) => {
    
   if(req.user) {
    req.logout(function (e) {
        if (e) {
            return next(e);
        }
        req.flash('success', 'Goodbye!');
       return res.status(200).redirect('/blogs');
        
    });
   }

   else {
   req.flash('error', 'You must be signed in first')
   res.status(400).redirect('/blogs')
   }
}); 

router.get('/users', async(req,res,next) => {
try {
 
   
    if(req.user && req.user.isAdmin) {
        const users = await User.find({})
        return res.status(200).render('users/allUsers', {users})
    }
    req.flash('error', 'You do not have permission to do that!')
    res.status(403).redirect('/')
}
catch(e) {
next(e)
}
})



module.exports = router
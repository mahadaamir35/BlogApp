const express = require('express')
const app = express();
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const blogRoutes = require('./routes/blogs')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')
const passport = require('passport')
const localStrategy = require('passport-local')
const session = require('express-session')
const flash = require('connect-flash')
const User = require('./models/user')


//creating session obj
const sessionConfig = {
    secret: 'thisismysecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly : true,
        expires: Date.now() + 604800000,
        maxAge: 604800000
    }
}
app.use(session(sessionConfig))
app.use(flash())



//using passport.js for authorization and authentication
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



//middleware that is used to create variables that will be accessible as a global variable in ejs templates
app.use((req,res,next) => {
console.log(req.session);
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.currentUser = req.user;
    next()
 })

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.set('view engine' , 'ejs')



app.get('/admin', async(req,res,next) => {
    try {
        const admin = new User({username: 'admin', isAdmin: true, email: 'admin@gmail.com'})
        await User.register(admin, 'admin')
        req.flash('success', 'ok admin!')
        res.redirect('/blogs')
    }
catch(e) {
    next(e)
}

})

//using all the routes
app.use('/blogs', blogRoutes)
app.use('/blogs/:id/reviews', reviewRoutes)
app.use('/', userRoutes)




mongoose.connect('mongodb://127.0.0.1:27017/blogApp')
.then(() => {
    console.log('db connected');
})


//home page
app.get('/', (req,res) => {
   res.render('home')
})


//if the requested path is not found
app.all('*', (req,res) => {
    res.status(404).render('error')
})


//middleware that is used for error handlindg and renders error template
app.use((err,req,res,next) => {
    res.status(500).render('error')
})

app.listen(3000, () => {
    console.log('listening on port 3000')
})
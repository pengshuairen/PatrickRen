const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
	  flash = require('connect-flash'),
	  passport = require("passport"),
	  LocalStrategy = require('passport-local'),
	  methodOverride = require('method-override'),
	  seedDB = require("./seeds"),
      Campground = require("./models/campground"),
	  User = require('./models/user'),
	  Comment = require("./models/comment");
//requiring routes
const campgroundRoutes     = require('./routes/campgrounds'),
	  commentRoutes        = require('./routes/comments'),
	  indexRoutes          = require('./routes/index');

mongoose.connect("mongodb://localhost:27017/yelp_camp_v0", { useNewUrlParser:true, useUnifiedTopology: true });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');


//seedDB();                               //seed the database

//PASSPORT CONFIG
app.use(require('express-session')({
	secret:"Patrick is gonna get jobs",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.warning = req.flash('warning');
	res.locals.success = req.flash('success');
	next();
});

//ROUTES APPLY
app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

//START SERVER
app.listen(3000, function(){
	console.log("The YelpCamp Server Has Started!");
});
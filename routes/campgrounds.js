const Campground = require('../models/campground'),
	  express = require('express'),
	  middleware = require("../middlewares/index"),
	  router = express.Router();



//index route to show the list of all campground
router.get("/", (req, res)=>{
	//get campgrounds from db
	Campground.find({},(err, campgrounds)=>{
		if(err){
			req.flash('error', "Something went wrong!");
			//console.log(err);
			res.redirect('/');
		}else{
			res.render("campground/index", {campgrounds:campgrounds, page: 'campgrounds'});
		}
	});
});

//new route to show the form for creation
router.get("/new", middleware.isLoggedIn, (req, res)=> {
	res.render("campground/new");
});

// create route to add new data to db
router.post("/", middleware.isLoggedIn, (req, res)=> {
	//add your campground from the form and add to the array
	const name = req.body.name;
	const image = req.body.image;
	const description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	const campground = {name: name, image: image, description: description, author: author};
	Campground.create(campground, (err, campground)=>{
		if(err){
			console.log(err);
		}else{
			//show your new campground on the campground web
	        res.redirect("/campgrounds/" + campground._id);
		}
	});
});

//show route to show the details of the chosen data
router.get("/:id",(req, res)=>{
	//get id from the data
	Campground.findById(req.params.id).populate("comments").exec((err, campground)=>{
		if (err || !campground){
			req.flash('error', 'campground not found!');
			res.redirect('back');
			//console.log(err)
		}else{
			//show the details of the data
			res.render("campground/show", {campground: campground});
		}
	});
});

//EDIT CAMPGROUND ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res)=>{
	Campground.findById(req.params.id, (err, campground)=>{
		if(err || !campground){
			req.flash('error', 'Campground not found!');
			res.redirect('back');
		}else{
			res.render('campground/edit', {campground: campground});
		}
	});
});

//UPDATE CAMPGROUND ROUTES
router.put('/:id', middleware.checkCampgroundOwnership, (req, res)=>{
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground)=>{
		if(err || !campground){
			req.flash("error", 'Something went wrong when updating!')
			res.redirect('/campgrounds');
		}else{
			res.redirect('/campgrounds/' + campground._id);
		}
	});
})

//DELETE CAMPGROUND ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res)=>{
	Campground.findByIdAndRemove(req.params.id, (err)=>{
		if(err){
			req.flash('error', 'Someting went wrong when deleting');
			res.redirect('/campgrounds');
		}else{
			res.redirect('/campgrounds');
		}
	});
});


module.exports = router;
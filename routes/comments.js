const express = require('express'),
	  Campground = require('../models/campground'),
	  Comment = require('../models/comment'),
	  middleware = require("../middlewares/index"),
	  router = express.Router({mergeParams: true});

//Comment New
router.get("/new", middleware.isLoggedIn, (req, res)=>{
	//find the campground by ID
	Campground.findById(req.params.id, (err, campground)=>{
		if(err || !campground){
			req.flash('error', "Campground you're commenting was not found!");
			res.redirect("/campgrounds");
		}else{
			res.render("comment/new", {campground:campground});
		}
	})
});

//Comment Creates
router.post("/", middleware.isLoggedIn, (req, res)=>{
	//find the campground by ID
	Campground.findById(req.params.id, (err, campground)=>{
		if(err || !campground){
			req.flash('error', "Campground you're commenting was not found!");
			res.redirect("/campgrounds");
		}else{
			//create comment to DB
			Comment.create(req.body.comment, (err, comment)=>{
				if(err || !comment){
					req.flash('error', "Ops, something goes wrong!");
					res.redirect("/campgrounds");
				}else{
					//add username and id
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					// add comment to campground
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

//EDIT COMMENT ROUTE
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res)=>{
	Campground.findById(req.params.id, (err, campground)=>{
		if(err || !campground){
			req.flash('error', "Campground you're commenting not found");
			res.redirect('back');
		}else{
			Comment.findById(req.params.comment_id, (err, comment)=>{
				if(err || !comment){
					req.flash('error', "Comment not found!");
					res.redirect('back');
				}else{
					res.render('comment/edit', {campground_id: req.params.id, comment: comment});
				}
			});
		}
	});
});

//Update COMMENT ROUTE
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment)=>{
		if(err || !comment){
			req.flash('error', "Something went wrong!");
			res.redirect('back');
		}else{
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

//DELETE COMMENT ROUTE
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res)=>{
	Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
		if(err){
			res.redirect('back');
		}else{
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});



module.exports = router;
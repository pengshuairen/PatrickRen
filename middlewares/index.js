const Campground = require('../models/campground'),
	  Comment = require('../models/comment');
//all middlewares go here
const middlewareObj = {};

//middleware
middlewareObj.isLoggedIn = function (req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	//console.log(req.originalUrl);
	req.session.returnTo = req.originalUrl;
	req.flash('error', "Sorry, You need to sign in for doing that!");
	res.redirect('/login');
}


middlewareObj.checkCampgroundOwnership = function (req, res, next){
	if (req.isAuthenticated()){
		Campground.findById(req.params.id, (err, campground)=>{
			if(err || !campground){
				req.flash("error", 'Campground not found!');
				res.redirect('back');
			}else{
				if(campground.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash('error', "Sorry! You don't have the permission to do that.");
					res.redirect('back');
				}	
			}
		});
	}else{
		req.flash('error', "Sorry, You need to sign in for doing that!");
		res.redirect('/login');
	}
}


middlewareObj.checkCommentOwnership = function (req, res, next){
	if (req.isAuthenticated()){
			Comment.findById(req.params.comment_id, (err, comment)=>{
				if(err || !comment){
					req.flash('error', 'Comment not found!');
					res.redirect('back');
				}else{
					if(comment.author.id.equals(req.user._id)){
						next();
					}else{
						req.flash('error', "Sorry! You don't have the permission to do that.");
						res.redirect('back');
					}	
				}
			});
	}else{
		req.flash('error', "Sorry, You need to sign in for doing that!");
		res.redirect('/login');
	}
}




module.exports = middlewareObj;
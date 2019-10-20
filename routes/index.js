const passport = require('passport'),
	  User = require('../models/user'),
	  middleware = require("../middlewares/index"),
	  express = require('express'),
	  router = express.Router();

//root route
router.get("/", (req, res)=> {
	res.render("landing");
});


//show register form
router.get('/register', (req, res)=>{
	res.render('register', {page: 'register'});
})

//handle signup logic
router.post('/register', (req, res)=> {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user)=>{
		if(err){
			req.flash('error', err.message);
			res.redirect("/register");
		}else{
			passport.authenticate("local")(req, res, function(){
				req.flash('success', "welcome to <strong>YelpCamp</strong> <strong><em>" + user.username + "</strong></em>");
				res.redirect('/campgrounds');
			});
		}
		
	})
});

//show login form
router.get('/login', (req, res)=>{
	res.render('login', {page: 'login'});
});

//handle login logic
// router.post('/login', passport.authenticate('local', 
// 	 	{
// 	  		successRedirect: req.session.returnTo || '/',
// 			failureRedirect: '/login'
// 		}),
// 		 (req, res)=>{
// });

router.post('/login', passport.authenticate('local'), 
		 (req, res)=>{
		//console.log('========');
	    //console.log(req.session.returnTo);
	    res.redirect(req.session.returnTo || 'back');
        delete req.session.returnTo;
});

//logout route
router.get('/logout', (req, res)=>{
	req.logout();
	req.flash('warning', "You have logged out!");
	res.redirect('/campgrounds');
});


module.exports = router;
var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');



var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/logout' ,isLoggedIn, function(req, res, next) {
 req.logout();
  res.redirect('/');
});

router.use('/', notLoggedIn, function (req, res, next) {
  next();
});

router.get('/signup', function (req, res, next) {
  var messages = req.flash('error');
  res.render('user/signup' , {csrfToken : req.csrfToken() , messages : messages , hasErrors:messages.length >0 });
});

router.post('/signup',passport.authenticate('local.signup', {
  failureRedirect: '/user/signin',
  failureFlash: true
}), function(req, res, next){
  if(req.session.oldUrl){
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  }else{
    res.redirect('user/profile');
  }
});


router.get('/signin', function (req, res, next) {
  
  var messages = req.flash('error');
 
  res.render('user/signin' , {csrfToken : req.csrfToken() , messages : messages , hasErrors:messages.length >0 });
});

//Defining routes of user login and signup
router.post('/signin',passport.authenticate('local.signin', {
  
  successRedirect : '/',
  failureRedirect: '/user/signup',
  failureFlash: true
}), function(req, res, next){
  console.log("Inside signin post");
  if(req.session.oldUrl){
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  }else{
    res.redirect('/');
  }
});





module.exports = router;


function isLoggedIn(req, res, next) {
  console.log(this.session);
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/user/signup');
}

function notLoggedIn(req, res, next) {
  console.log(this.session);
  if(!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}



// Render Search Page 

  

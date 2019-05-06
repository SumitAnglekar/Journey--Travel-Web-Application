var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done){
    done(null,user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){

    console.log("Reached");
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({min: 4});
    var errors = req.validationErrors();
    if(errors){
        console.log("error1");
        var messages = [];
        errors.forEach(function(error){
            console.log("error1" +error.msg);
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error',messages));
    }
    User.findOne({'email': email}, function(err, user){
        if(err){
            console.log("error3" +err);
            return done(err);
        }
        if(user){
             console.log("Email");
            return done(null, false , {message: 'Email already in use'})
        }
        var newUser = new User();
        newUser.email = email;
         console.log("Email ::" +email);
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function(err, result){
            if(err){
                console.log("error2" +err);
                return done(err);
            }
            return done(null, newUser);
        })
    })
}));


passport.use('local.signin', new LocalStrategy({

    usernameField: 'email',
    passportField: 'password',
    passReqToCallback: true

}, function(req, email, password, done){
    console.log("REACHED !!!!!");
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty();
    var errors = req.validationErrors();
    if(errors){
        var messages = [];
        errors.forEach(function(error){
            console.log("error2" +error.msg);
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error',messages));
    }
    User.findOne({'email': email}, function(err, user){
        if(err){
            console.log("error2" +err);
            return done(err);
        }
        if(!user){
            console.log("User does not exists.");
            return done(null, false , {message: 'User does not exists.'});
        }
        if(!user.validPassword(password)){
             console.log("Invalid password.");
            return done(null, false , {message: 'Invalid password.'})
        }
        return done(null, user);

    })
}));


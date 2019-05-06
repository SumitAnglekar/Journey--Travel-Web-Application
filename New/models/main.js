var express = require('express');
var router = express.Router();


//Protected route example
router.get('/protected', isLoggedIn, function(req, res, next) { 
   res.render('protected/protected', { title: 'Shopping Cart' , products : productChunks ,successMsg : successMsg , noMessages : ! successMsg });
});

module.exports = router;


function isLoggedIn(req, res, next){
    if (!req.isAuthenticated()) {
        req.session.oldUrl = req.url;
        return res.redirect('/user/signin');
    }
    next();
}
var express = require('express');
var router = express.Router();
var flight =  require('../models/flight');
var request = require('request');
// Add your credentials:
// Add your client ID and secret
var CLIENT =
 'Abiy_Nj7GM1l4Z2KEmHC_HwsHb3sNjOB8vm2-kNYMs1LVcFl7mvfdafA9dyH7hKSioDZClFH8dFgOdVW';
var SECRET =
 'EDvaKDbn2Fg22EO6hmVLF3R39p_e3oDseEn4hIc-dP7jETwb451l1xR8YrFdtIfiwDd4i3ASWCDxQ87s';
var PAYPAL_API = 'https://api.sandbox.paypal.com';
express()

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Journey' });
});

module.exports = router;



function isLoggedIn(req, res, next){
    if (!req.isAuthenticated()) {
        req.session.oldUrl = req.url;
        return res.redirect('/user/signin');
    }
    next();
}


router.post('/search', function (req, res, next) {
 console.log("Inside Search : "+req.body.destination);
   //console.log("Inside Search : "+req.params.destination);

            flight.find({ $and: [ { 'Source': {$regex: new RegExp('^' + req.body.source, 'i')}   }, { 'Destination': {$regex: new RegExp('^' +req.body.destination, 'i')} },{ 'DepartureDate': req.body.date }  ] }, function(err, flightdetails) {
                // if there is an error retrieving, send the error.

                                // nothing after res.send(err) will execute
                if (err) {
                    res.send(err);
                
                console.log('Flight', flightdetails);
            }else {
            	console.log('Flight', flightdetails);
            	res.render('search' , {flights:flightdetails});
            }
                //res.json(samples);
            
            });

        });



router.get('/passenger/:id',isLoggedIn ,function (req, res, next) {
 flight.findById(req.params.id , function(err ,foundBlog){

    if(err){

      res.redirect("/search");
    } else {

      res.render("passenger" , {flights:foundBlog});
    }



  });

        });


// router.post('/passenger/:id', function (req, res, next) {
//  console.log("Inside passanger ::") ; 
 
 
// flight.findById(req.params.id , function(err ,foundDetails){

//     if(err){

//       res.redirect("/search");
//     } else {

//       res.render("passenger" , {flights:foundDetails});
//     }



//   });

//         });



// ROutes for Campgrounds
  router.get("/blog",isLoggedIn,function(req,res){
	res.render("landing");
}) ;

  router.get("/about",function(req,res){
    res.render("about");
}) ;

  router.get("/gallery",function(req,res){
    res.render("gallery");
}) ;

router.get("/contacts",function(req,res){
    res.render("contacts");
}) ;




//


router.post('/my-api/create-payment/', function(req, res)
{
 // 2. Call /v1/payments/payment to set up the payment
 request.post(PAYPAL_API + '/v1/payments/payment',
 {
   auth:
   {
     user: CLIENT,
     pass: SECRET
   },
   body:
   {
     intent: 'sale',
     payer:
     {
       payment_method: 'paypal'
     },
     transactions: [
     {
       amount:
       {
         total: '5.99',
         currency: 'USD'
       }
     }],
     redirect_urls:
     {
       return_url: 'https://www.mysite.com',
       cancel_url: 'https://www.mysite.com'
     }
   },
   json: true
 }, function(err, response)
 {
   if (err)
   {
     console.error(err);
     return res.sendStatus(500);
   }
   // 3. Return the payment ID to the client
   res.json(
   {
     id: response.body.id
   });
 });
})
// Execute the payment:
// 1. Set up a URL to handle requests from the PayPal button.
router.post('/my-api/execute-payment/', function(req, res)
{
 // 2. Get the payment ID and the payer ID from the request body.
 var paymentID = req.body.paymentID;
 var payerID = req.body.payerID;
 // 3. Call /v1/payments/payment/PAY-XXX/execute to finalize the payment.
 request.post(PAYPAL_API + '/v1/payments/payment/' + paymentID +
   '/execute',
   {
     auth:
     {
       user: CLIENT,
       pass: SECRET
     },
     body:
     {
       payer_id: payerID,
       transactions: [
       {
         amount:
         {
           total: '10.99',
           currency: 'USD'
         }
       }]
     },
     json: true
   },
   function(err, response)
   {
     if (err)
     {
       console.error(err);
       return res.sendStatus(500);
     }
     // 4. Return a success response to the client
     res.json(
     {
       status: 'success'
     });
   });
})



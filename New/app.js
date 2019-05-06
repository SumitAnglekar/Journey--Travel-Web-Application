var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var methodOverride = require("method-override");
var mongoStore = require('connect-mongo')(session);

var index = require('./routes/index');
var userRoutes = require('./routes/user');
var Campground  = require("./models/campground");
var Comment     = require("./models/comment");
var User        = require("./models/user");

var app = express();

//requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")


var port = process.env.PORT || 8080;
mongoose.connect('mongodb://localhost/example'); 
require('./config/passport');
app.use(methodOverride("_method"));

// view engine setup

app.set('view engine', '.ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
  secret : 'mysupersecret',
  resave : false,
  saveUninitialized : false,
  store: new mongoStore({mongooseConnection : mongoose.connection}),
  cookie : { maxAge: 180 * 60 * 1000}
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

app.use('/user', userRoutes);
app.use('/', index);
//app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.messages = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.listen(port);
console.log('The magic happens on port ' + port);
module.exports = app;


//SCHEMA SETUP

/*var FlightSchema = new mongoose.Schema({

   FlightId: String,
    Source : String,
    Destination : String , 
  DepartureDate : String,
  DepartureTime :String , 
  ArrivalDate : String ,
  ArrivalTime : String ,
  TicketPrice : Number,
  AirlineImage : String ,
  AirlineName : String,
  seats : [ [ 0, 0, 0, 0, 0, 0 ]
    , [ 0, 0, 0, 0, 0, 0 ]
    , [ 0, 0, 0, 0, 0, 0 ]
    , [ 0, 0, 0, 0, 0, 0 ]
    , [ 0, 0, 0, 0, 0, 0 ]
    , [ 0, 0, 0, 0, 0, 0 ] ],

     



});

var flightDetails = mongoose.model("flightDetails",FlightSchema); 


flightDetails.create(


  {

    FlightId: "F111",
    Source : "Boston",
    Destination : "San Francisco" , 
    DepartureDate : "12/10/2018",
    DepartureTime :"11:35:00" , 
    ArrivalDate : "12-10-2018" ,
    ArrivalTime : "19:35:00" ,
    TicketPrice : 450,
    AirlineImage : "https://i.pinimg.com/564x/6c/33/b7/6c33b7d2fbc185bd27dddc9f20c10edc.jpg" ,
    AirlineName : "Koala",
    seats : [ [ 0, 0, 0, 0, 0, 0 ]
      , [ 0, 0, 0, 0, 0, 0 ]
       , [ 0, 0, 0, 0, 0, 0 ]
      , [ 0, 0, 0, 0, 0, 0 ]
    , [ 0, 0, 0, 0, 0, 0 ]
    , [ 0, 0, 0, 0, 0, 0 ] ],





  } ,

 {
    FlightId: "F112",
    Source : "Boston",
    Destination : "San Francisco" , 
    DepartureDate : "12-10-2018",
    DepartureTime :"09:35:00" , 
    ArrivalDate : "12-10-2018" ,
    ArrivalTime : "19:30:00" ,
    TicketPrice : 350,
    AirlineImage : "https://i.pinimg.com/564x/7c/c5/69/7cc56987e399dc64cc5011d54d5e2bbe.jpg" ,
    AirlineName : "Mango",
    seats : [ [ 0, 0, 0, 0, 0, 0 ]
      , [ 0, 0, 0, 0, 0, 0 ]
       , [ 0, 0, 0, 0, 0, 0 ]
      , [ 0, 0, 0, 0, 0, 0 ]
    , [ 0, 0, 0, 0, 0, 0 ]
    , [ 0, 0, 0, 0, 0, 0 ] ],





  } ,


   {
    FlightId: "F113",
    Source : "Boston",
    Destination : "Seattle" , 
    DepartureDate : "12-12-2018",
    DepartureTime :"09:35:00" , 
    ArrivalDate : "12-08-2018" ,
    ArrivalTime : "19:35:00" ,
    TicketPrice : 550,
    AirlineImage : "https://i.pinimg.com/564x/7c/c5/69/7cc56987e399dc64cc5011d54d5e2bbe.jpg" ,
    AirlineName : "Koala",
    seats : [ [ 0, 0, 0, 0, 0, 0 ]
      , [ 0, 0, 0, 0, 0, 0 ]
       , [ 0, 0, 0, 0, 0, 0 ]
      , [ 0, 0, 0, 0, 0, 0 ]
    , [ 0, 0, 0, 0, 0, 0 ]
    , [ 0, 0, 0, 0, 0, 0 ] ],





  } ,

  {
    FlightId: "F114",
    Source : "Boston",
    Destination : "Seattle" , 
    DepartureDate : "12-12-2018",
    DepartureTime :"11:35:00" , 
    ArrivalDate : "12-12-2018" ,
    ArrivalTime : "19:35:00" ,
    TicketPrice : 350,
    AirlineImage : "https://i.pinimg.com/564x/6c/33/b7/6c33b7d2fbc185bd27dddc9f20c10edc.jpg" ,
    AirlineName : "Mango",
    seats : [ [ 0, 0, 0, 0, 0, 0 ]
      , [ 0, 0, 0, 0, 0, 0 ]
       , [ 0, 0, 0, 0, 0, 0 ]
      , [ 0, 0, 0, 0, 0, 0 ]
    , [ 0, 0, 0, 0, 0, 0 ]
    , [ 0, 0, 0, 0, 0, 0 ] ],





  } , 

  {

    FlightId: "F115",
    Source : "Seattle",
    Destination : "Chicago" , 
    DepartureDate : "12-10-2018",
    DepartureTime :"11:35:00" , 
    ArrivalDate : "12-10-2018" ,
    ArrivalTime : "19:35:00" ,
    TicketPrice : 450,
    AirlineImage : "https://i.pinimg.com/564x/6c/33/b7/6c33b7d2fbc185bd27dddc9f20c10edc.jpg" ,
    AirlineName : "Koala",
    seats : [ [ 0, 0, 0, 0, 0, 0 ]
      , [ 0, 0, 0, 0, 0, 0 ]
       , [ 0, 0, 0, 0, 0, 0 ]
      , [ 0, 0, 0, 0, 0, 0 ]
    , [ 0, 0, 0, 0, 0, 0 ]
    , [ 0, 0, 0, 0, 0, 0 ] ],





  } ,

  {

    FlightId: "F116",
    Source : "Seattle",
    Destination : "Chicago" , 
    DepartureDate : "12-10-2018",
    DepartureTime :"04:35:00" , 
    ArrivalDate : "12-10-2018" ,
    ArrivalTime : "12:35:00" ,
    TicketPrice : 450,
    AirlineImage : "https://www.socialbakers.com/www/storage/www/reports/2016-09-01/twitter/18909186.jpg" ,
    AirlineName : "Bakers",
    seats : [ [ 0, 0, 0, 0, 0, 0 ]
      , [ 0, 0, 0, 0, 0, 0 ]
       , [ 0, 0, 0, 0, 0, 0 ]
      , [ 0, 0, 0, 0, 0, 0 ]
    , [ 0, 0, 0, 0, 0, 0 ]
    , [ 0, 0, 0, 0, 0, 0 ] ],





  } ,

  {

    FlightId: "F117",
    Source : "Seattle",
    Destination : "Chicago" , 
    DepartureDate : "12-10-2018",
    DepartureTime :"09:35:00" , 
    ArrivalDate : "12-10-2018" ,
    ArrivalTime : "12:35:00" ,
    TicketPrice : 650,
    AirlineImage : "https://www.socialbakers.com/www/storage/www/reports/2016-09-01/twitter/18909186.jpg" ,
    AirlineName : "Bakers",
    seats : [ [ 0, 0, 0, 0, 0, 0 ]
      , [ 0, 0, 0, 0, 0, 0 ]
       , [ 0, 0, 0, 0, 0, 0 ]
      , [ 0, 0, 0, 0, 0, 0 ]
    , [ 0, 0, 0, 0, 0, 0 ]
    , [ 0, 0, 0, 0, 0, 0 ] ],





  } ,




 function(err,flightDetails){

    if(err){
      console.log(err);
    }else {
      console.log("New flight");
      console.log(flightDetails)
    }


  }

  );*/
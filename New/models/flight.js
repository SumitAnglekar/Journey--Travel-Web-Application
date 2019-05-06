var mongoose = require 	("mongoose");


var FlightSchema = new mongoose.Schema({

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
    , [ 0, 0, 0, 0, 0, 0 ] ]

     



});

	module.exports = mongoose.model("flightDetails",FlightSchema);

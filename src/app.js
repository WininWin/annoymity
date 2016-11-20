//require
var express = require('express');
var mongoose = require('mongoose');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var bodyParser = require('body-parser');

var wordFilter = require('./wordFilter.js');

//servier init
var app = express();
app.use(express.static(__dirname + '/public/'));
var port = process.env.PORT || 80;
console.log("Express server running on " + port);
app.listen(process.env.PORT || port);
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


//db schema
var wordsSchema = mongoose.Schema({
    words: String,
    color : String,
    weight : String
});
var WordsModel = mongoose.model('words_model', wordsSchema);


//db init
var db = mongoose.connection;
db.on('error', console.error);


//db connect
mongoose.connect('mongodb://localhost/anoymity_speech');
db.once('open', function() {
 	
 	//receive data
 	app.post('/words', function(req,res,err){
 		
 		var words = req.body.words;

 		var words_after_filtering = wordFilter.Filtering(words);

 		var words_for_db = new WordsModel({words : words_after_filtering, color : req.body.color, weight : req.body.weight});

 		var word_Count = (words_after_filtering.split(' ')).length;
 		var character_Count = (words_after_filtering.split("")).length;


 		// 100 words limit + ' / ', 1000 characters limit
 		if(word_Count <= 101 && character_Count <= 1001){
 			//save to db
	   		words_for_db.save(function(err,silence){
			if(err){
				    console.err(err);
				    throw err;
				}
		    });

	 		//send data
	 		res.send(words_for_db);
 		}

 		

 	});
	

	//init browser
	app.get('/all', function(req,res,err){

	    WordsModel.find().skip(parseInt(req.query.skip)).limit(parseInt(req.query.limit)).exec(function(err,all){
	        if(err){
	            console.log(err);
	            throw err;
	        }

	        res.send(all);
		    });
	});




});

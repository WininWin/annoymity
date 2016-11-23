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
var port = process.env.PORT || 3000;
console.log("Express server running on " + port);
//app.listen(process.env.PORT || port);
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

var http =  require('http').Server(app);
var io   =  require("socket.io")(http);
http.listen(port,function(){
    console.log("Listening on " + port);
});

//db schema
var wordsSchema = mongoose.Schema({
    words: String,
    color : String,
    weight : String,
    createdAt: {type: Date, default: Date.now}
});
var WordsModel = mongoose.model('words_model', wordsSchema);


//db init
var db = mongoose.connection;
db.on('error', console.error);


//db connect
mongoose.connect('mongodb://localhost/anonymity_db');

//db open
db.once('open', function() {
	//socket io connect
	io.on('connection',function(socket){ 
	  	

		 	//receive data and save to db
		 	app.post('/words', function(req,res,err){
		 		
		 		var words = req.body.words;

		 		//filter the words
		 		var words_after_filtering = wordFilter.Filtering(words);

		 		var words_for_db = new WordsModel({words : words_after_filtering, color : req.body.color, weight : req.body.weight});

		 		var word_Count = (words_after_filtering.split(' ')).length;
		 		var character_Count = (words_after_filtering.split("")).length;


		 		// 100 words limit + ' / ', 1000 characters limit
		 		if(word_Count <= 51 && character_Count <= 501){
		 			//save to db
			   		words_for_db.save(function(err,silence){
					if(err){
						    console.err(err);
						    throw err;
						}
				    });

			 		//send data
			 		if(res){
			 				res.send(words_for_db);
				            io.emit('refresh feed',words_for_db);
				    } 
				    else {
				            io.emit('error');
				        }
		 		}

	 		

	 	});



		
	 	
		

		//init browser
		app.get('/all', function(req,res,err){

		    WordsModel.find().sort({createdAt: -1}).skip(parseInt(req.query.skip)).limit(parseInt(req.query.limit)).exec(function(err,all){
		        if(err){
		            console.log(err);
		            throw err;
		        }

		        res.send(all);
			    });
		});

		//get total data counts
		app.get('/count', function(req, res, err){
			WordsModel.count({}, function( err, count){

    			if(err){
    				console.log(err);
    			}

    			res.send(count.toString());

    		});
		});

	
	});



});


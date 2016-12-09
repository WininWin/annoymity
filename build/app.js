process.env.NODE_ENV = 'production';
process.env.PORT = 80;;//require
const express = require('express');
const mongoose = require('mongoose');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const bodyParser = require('body-parser');

const wordFilter = require('./wordFilter.js');

const cloud = require("./public/js/d3.layout.cloud.js");


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
    word: String,
    size: Number,
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

		 		var remove_dup = new Set(words_after_filtering.split(' '));
		 		var arr = [...remove_dup];
		 		
		 	
		 		while(arr.length !== 0){

		 			var item = arr.pop();
		 			
		 			(function(item){
		 				
		 				WordsModel.findOne({ word: item }, function (err, doc) {
							if(err){
								console.log(err);	
							}
							if(doc!==null){
								doc.size = doc.size + 1;
							  doc.save(function(err, sil){
							  	if(err) throw err;
							  });
							}
							else{
								var word_for_db = new WordsModel({word : item, size : 1});
							 	word_for_db.save(function(err, sil){
							  	if(err) throw err;
							  	});
							}
						 
					});

		 			})(item);
		 			
		 		}

		 		

		 		var word_Count = (words_after_filtering.split(' ')).length;
		 		var character_Count = (words_after_filtering.split("")).length;


		 		// 30 words limit, 150 characters limit
		

		       if(word_Count <= 30 && character_Count <= 150){

			 		//send data
			 		if(res){
			 				
			 			
				            io.emit('refresh feed', words_after_filtering);
				    } 
				    else {
				            io.emit('error');
				        }
		 		}

		      
		 		
	 		

	 	});



		
	 	
		

		//init browser
		app.get('/all', function(req,res,err){

		    WordsModel.find().exec(function(err,all){
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


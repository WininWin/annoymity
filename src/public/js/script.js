var maxSubmits = 5;
var intervalMilliseconds = 10000; // for testing   
var timesSubmitted = 0;
var interval;   


//word counts
function wordCount(words) {
	
	//remove line and space at the end and beginning of the string
	words = words.trim();
	word_array = words.replace(/\r?\n|\r/g, " ");


	//remove double space
 	word_array = word_array.replace(/\s\s+/g,' ');

 	word_array = word_array.split(" ");

 	return word_array.length;
	
}


	
var skip = 0;
$(document).ready(function() {


	//count words or characters
	$('#input_box').on('input', function() {

		//count
		var w_count = wordCount($('#input_box').val());
		var c_count = (($('#input_box').val()).split('')).length;

		//view 
		$("#wordcount").text("Word Count : " + w_count);
		$("#chara_count").text("Character Count : " + c_count);


		//empty
		if($('#input_box').val() === ""){
			$("#wordcount").text("Word Count : 0" );
		}

		//exceed 100 words
		if(w_count >= 100){
			$('#input_box').keypress(function(e) {
				    e.preventDefault();
				});
		}
		//detach preventdefuat 
		else{
				$('#input_box').off("keypress");
		}


	});

	//browser init
	$.get("/all?skip=0&limit=500", function(result) {

		for(var i = 0; i < result.length;i++){
			$(".words-body").prepend("<span style = \'color:" + result[i].color + ";font-weight:"+ result[i].weight+ "\'>" + result[i].words + "</span>");
		}
		skip = 500;

	});

	$('#comment').submit(function() {


		 if (!interval) {
            interval = setTimeout(function () {
                interval = undefined;
                timesSubmitted = 0;
            }, intervalMilliseconds);
	        }
	        timesSubmitted ++;
	   		 if (timesSubmitted > maxSubmits) {
	            $('#error_msg').text('Too many submit attempts!!').fadeIn('1000').fadeOut('4000');
	            return false;
	        } 
	       else{
		       	var w_count = wordCount($('#input_box').val());
				var c_count = (($('#input_box').val()).split('')).length;


				//copy and paste exceed 100 words or 1000 characters
				if(w_count > 100 || c_count > 1000){
					$("#error_msg").text("You exceed 100 words or 1000 characters");
					return false;
				}
				//data send
				$(this).ajaxSubmit({

					 error: function(xhr) {
		                console.log(xhr.status);
		            },

		            //data recieve
		            success: function(response) {
		            	console.log(response);
		            	$(".words-body").prepend("<span style = \'color:" + response.color + ";font-weight:"+ response.weight+ "\'>" + response.words + "</span>");	

		            
						
		            }

				});

				// Prevent default form action 
				return false;
	       }
			

			
	});
		


	//onscroll
	var lastScrollTop = 0;
	$(window).scroll(function(event){
	  if($(window).scrollTop() + $(window).height() == $(document).height()) {
	      $.get("/all?skip=" + skip + "&limit=500", function(result) {

			for(var i = 0; i < result.length;i++){
				$(".words-body").prepend("<span style = \'color:" + result[i].color + ";font-weight:"+ result[i].weight+ "\'>" + result[i].words + "</span>");
			}
			skip = skip + 500;
		});
	   }
	
	});






});




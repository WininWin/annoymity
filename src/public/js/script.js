 
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

function getRandomPositionTop(){
	var field_pos_top = $("#main").offset().top;
	var field_pos_top_width = field_pos_top + $("#main").height();

	var random_up_pos = (Math.random() * field_pos_top); 
	var random_down_pos = field_pos_top_width + (Math.random() * ($(document.body).height()-field_pos_top_width));

	var half_percent = Math.random();

	return (half_percent<0.5)?random_up_pos:random_down_pos;
}

function getRandomPositionLeft(){
	var field_pos_left = $("#main").offset().left;
	var field_pos_left_width = field_pos_left + $("#main").width();

	var random_left_pos = (Math.random() * field_pos_left);
	var random_right_pos = field_pos_left_width + (Math.random() * ($(document.body).width()-field_pos_left_width));

	var half_percent = Math.random();

	return (half_percent<0.5)?random_left_pos:random_right_pos;
}
	
var skip = 0;
$(document).ready(function() {
	  var socket = io();
	   socket.on('refresh feed',function(response){
            $(".words-body").prepend("<span style = \'color:" + response.color + ";font-weight:"+ response.weight+ "\'>" + response.words + "</span>");	
		            	
		     var top_pos = getRandomPositionTop();
		     var left_pos = getRandomPositionLeft();

		     var str = (response.words).trim();
		     str = str.slice(0, -1); // remove '/ '

		     var elem = $('<div />').addClass('row pop-up-box').css({'left': left_pos, 'top' : top_pos});
		     elem.append("<div class=\'col-md-12\' style = \'color:" + response.color + ";font-weight:"+ response.weight+ "\'>" + str + "</div>");
		            	
		      $(document.body).append(elem);
		       elem.hide().fadeIn('slow');
		       elem.delay('2000').fadeOut("slow");
       });
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
		if(w_count > 50){
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
			$(".words-body").append("<span style = \'color:" + result[i].color + ";font-weight:"+ result[i].weight+ "\'>" + result[i].words + "</span>");
		}
		skip = 500;

	});

	$('#comment').submit(function() {


		 if (!interval) {
            interval = setTimeout(function () {
                interval = undefined;
                timesSubmitted = 0;
            }, 10000);
	        }
	        timesSubmitted ++;
	   		 if (timesSubmitted > 5) {
	            $('#error_msg').text('Too many submit attempts!!').fadeIn('slow').delay('2000').fadeOut('slow');
	            return false;
	        } 
	       else{
		       	var w_count = wordCount($('#input_box').val());
				var c_count = (($('#input_box').val()).split('')).length;

				//copy and paste exceed 100 words or 1000 characters
				if(w_count > 50 || c_count > 500){
					$("#error_msg").text("You exceed 50 words or 500 characters");
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
				$(".words-body").append("<span style = \'color:" + result[i].color + ";font-weight:"+ result[i].weight+ "\'>" + result[i].words + "</span>");
			}
			skip = skip + 500;
		});
	   }
	
	});






});




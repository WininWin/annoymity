 
//global
var timesSubmitted = 0;
var interval;  
var skip = 0;
var init_words = [];
var layout;
var d3_layer;
var fill;
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


/**
 * Count words in string
 * @param {String} words
 * @return {Number} Number of words
 */
function wordCount(words) {
	
	//remove line and space at the end and beginning of the string
	words = words.trim();
	word_array = words.replace(/\r?\n|\r/g, " ");


	//remove double space
 	word_array = word_array.replace(/\s\s+/g,' ');

 	word_array = word_array.split(" ");

 	return word_array.length;
	
}
/**
 * get random top position from document except input field
 * @return {Number} random position
 */
function getRandomPositionTop(){
	var field_pos_top = $("#main").offset().top;
	var field_pos_top_width = field_pos_top + $("#main").height();

	var random_up_pos = (Math.random() * field_pos_top); 
	var random_down_pos = field_pos_top_width + (Math.random() * ($(document.body).height()-field_pos_top_width));

	var half_percent = Math.random();

	return (half_percent<0.5)?random_up_pos:random_down_pos;
}

/**
 * get random left position from document except input field
 * @return {Number} random position
 */
function getRandomPositionLeft(){
	var field_pos_left = $("#main").offset().left;
	var field_pos_left_width = field_pos_left + $("#main").width();

	var random_left_pos = (Math.random() * field_pos_left);
	var random_right_pos = field_pos_left_width + (Math.random() * ($(document.body).width()-field_pos_left_width));

	var half_percent = Math.random();

	return (half_percent<0.5)?random_left_pos:random_right_pos;
}

//document init
$(document).ready(function() {


	$("#loading").hide();
	$("#main").hide();
	//socket io
	  var socket = io();
	  
	  //show other users input

	   socket.on('refresh feed',function(response){
		    
		     var top_pos = getRandomPositionTop();
		     var left_pos = getRandomPositionLeft();

		     var elem = $('<div />').addClass('row pop-up-box').css({'left': left_pos, 'top' : top_pos});
		     elem.append("<div class=\'col-md-12\'>" + response + "</div>");
		            	
		      $(document.body).append(elem);
		       elem.hide().fadeIn('slow');
		       elem.delay('2500').fadeOut("slow");
		       $.get("/count", function(result){
					$("#Total").text("Total Count : " + result);
				});
		    		


				
		       setTimeout(function(){

		       	 elem.remove();
		       	}, 3000);
		      
       });

       socket.on('refresh d3', function(response){

       		if(response === 'done'){
       			$.get("/all", function(result) {
			
						init_words = result;
							
			       layout
					    .words(init_words.map(function(d) {
					      return {text: d.word, size: d.size};
					    }))
					    .padding(5)
					    .rotate(function() { return ~~(Math.random() * 2) * 90; })
					    .font("Impact")
					    .fontSize(function(d) { return d.size; })
					    .on("end", update);

					    layout.start();

					     if (timesSubmitted < 6) {
					    $("#submit").show();
						$("#loading").hide();
						}
					   
					});
       		}
       			  
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

		//exceed 30 words
		if(w_count > 30){
			$('#input_box').keypress(function(e) {
				    e.preventDefault();
				});
		}
		//detach preventdefault
		else{
				$('#input_box').off("keypress");
		}


	});

	//browser init
	$.get("/all", function(result) {
		
		init_words = result;	

		
layout = d3.layout.cloud()
		    .size([window.innerWidth, window.innerHeight]);
	d3_layer =  d3.select("body").append("svg")
      .attr("width", layout.size()[0])
      .attr("height", layout.size()[1])
      .append("g")
      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")");
	fill = d3.scaleOrdinal(d3.schemeCategory20);
	
		layout
		    .words(init_words.map(function(d) {

		      return {text: d.word, size: d.size};
		    }))
		    .padding(5)
		    .rotate(function() { return ~~(Math.random() * 2) * 90; })
		    .font("Impact")
		    .fontSize(function(d) { return d.size; })
		    .on("end", draw);

		layout.start();

		$("#doc_loading").hide();
		$("#main").fadeIn();





	});

	$.get("/count", function(result){
		
		$("#Total").text("Total Count : " + result);
	});

	


	//send data to server 
	$('#comment').submit(function(event) {
		$("#submit").hide();
		$("#loading").show();
		var cookie = getCookie("toomanyattempts");
		if(cookie !== "" && cookie !== 'NaN'){
			timesSubmitted = parseInt(cookie);
		}
		
		 if (!interval) {
            interval = setTimeout(function () {
                interval = undefined;
                timesSubmitted = 0;
                setCookie('toomanyattempts', '0', 1);
                $("#loading").hide();
                $("#submit").show();
            }, 60000);
	        }
	         timesSubmitted = timesSubmitted+1;
	        setCookie('toomanyattempts', timesSubmitted, 1);
	   		if (timesSubmitted > 5) {
	   		 
	            $('#error_msg').text('Too many submit attempts!!').fadeIn('slow').delay('2000').fadeOut('slow');
	            return false;
	        } 
	       else{
		       	var w_count = wordCount($('#input_box').val());
				var c_count = (($('#input_box').val()).split('')).length;

				//copy and paste exceed 30 words or 150 characters
				if(w_count > 30 || c_count > 150){
					$("#error_msg").text("You exceed 30 words or 150 characters").fadeIn('slow').delay('2000').fadeOut('slow');
					$("#submit").show();
					 $("#loading").hide();
					return false;
				}
				//data send
				$(this).ajaxSubmit({

					 error: function(xhr) {
		                console.log(xhr.status);
		            },

		            //data recieve
		            success: function(response) {
		            	
						
			        }

				});

				// Prevent default form action 
				return false;
	       }
			

			
	});
		





});


/**
 * draw d3 layout
 * @param {Array} Object Array
 */
function draw(words) {
 	d3_layer
        .selectAll("text")
      .data(words, function(d){return d;})
    .enter().append("text")
      .style("font-size", function(d) { return d.size + "px"; })
      .style("font-family", "Impact")
      .style("fill", function(d, i) { return fill(i); })
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; });
}

/**
 * Update d3 layout
 * @param {Array} Object Array
 */
function update(data) {
	
  // DATA JOIN
  // Join new data with old elements, if any.
  var text = d3_layer.selectAll("text")
    .data(data, function(d) { return d; });
    
  // UPDATE
  // Update old elements as needed.
  text.transition().duration(500)
  	.on("start", function() {  // Start animation
         d3.select(this); // 'this' means the current element
       
     })
  	.delay(function(d, i) {
               return i / data.length * 500;  // Dynamic delay (i.e. on item delays a little longer)
        })
     .on("end", function() {  // End animation
                    d3.select(this)  
                    .transition()
                    .duration(500)
                    .attr("text-anchor", "middle")
			 .attr("transform", function(d) {
				  return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
			})
				.text(function(d) { return d.text; });
						      })
     .style("font-size", function(d) { 
     	if(d.size > 60){
     		d.size = 60;
     	}
     	return d.size + "px"; 
     })
      .style("font-family", "Impact")
       .style("fill", function(d, i) { return fill(i); });
  // ENTER
  // Create new elements as needed.
  // ENTER + UPDATE
  // After merging the entered elements with the update selection,
  // apply operations to both.
  text.enter().append("text")
  	.transition()
  	.duration(500)
  	.on("start", function() {  // Start animation
         d3.select(this); // 'this' means the current element
       
     })
  	.delay(function(d, i) {
               return i / data.length * 500;  // Dynamic delay (i.e. on item delays a little longer)
        })
     .on("end", function() {  // End animation
                    d3.select(this)  
                    .transition()
                    .duration(500)
                    .attr("text-anchor", "middle")
			 .attr("transform", function(d) {
				  return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
			})
				.text(function(d) { return d.text; });
						      })
     .style("font-size", function(d) { 
     	if(d.size > 60){
     		d.size = 60;
     	}
     	return d.size + "px"; })
      .style("font-family", "Impact")
       .style("fill", function(d, i) { return fill(i); });
  // EXIT
  // Remove old elements as needed.
   text.exit().remove();
}


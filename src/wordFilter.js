//word filtering module
var wordFilter = (function() {
		

	
	/**
	 * Filtering the user input
	 * @param {String} words
	 * @return {String} words after filtering
	 */
	function filter(words) {

		//prevent script 
		words = words.replace(/&/g, '&amp');
		words = words.replace(/</g, '&lt');
		words = words.replace(/>/g, '&gt');
		

		//prevent too many spaces
		words = words.replace(/\s\s+/g, ' ');

		//remove next lines
		words = words.replace(/\r?\n|\r/g, ' ');

		

		//add a / for sepaerating each input
		return words + " / ";


	}


	return {
		Filtering : function(words){

			return filter(words);
		},


	};


	
})();

module.exports = wordFilter;
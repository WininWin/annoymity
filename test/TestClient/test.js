var expect = chai.expect;

describe('wordCount', function() {
  describe('#wordCountTestOne()', function() {
    it('should return 5 when the value "one two three four five"', function() {

    	var count = wordCount("one tow three four five");

      	expect(5).to.equal(count);
    });
  });


   describe('#wordCountTestTwo()', function() {
    it('should return 5 when the value "one two three\nfour five    "', function() {

    	var count = wordCount("one two three\nfour five    ");

      	expect(5).to.equal(count);
    });
  });


});





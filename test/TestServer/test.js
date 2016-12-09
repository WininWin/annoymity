var assert = require('assert');

var wordFilter = require('../../src/wordFilter.js');



describe('wordFilter', function() {
  describe('#filteringTestOne()', function() {
    it('should return "test" when the value is "test"', function() {

    	var result = wordFilter.Filtering("test");

      assert.equal("test", result);
    });
  });

  describe('#filteringTestTwo()', function() {
    it('should return "script" when the value is <script>', function() {

    	var result = wordFilter.Filtering("<script>");

      assert.equal("script", result);
    });
  });

   describe('#filteringTestThree()', function() {
    it('should return "no double space" when the value is "  no  				double               space                       "', function() {

    	var result = wordFilter.Filtering("  no  double  space  ");

      assert.equal("no double space", result);
    });
  });

   describe('#filteringTestFour()', function() {
    it('should return "no line please / " when the value is "no line\nplease"', function() {

    	var result = wordFilter.Filtering("no line \n please");

      assert.equal("no line please", result);
    });
  });


   describe('#filteringTestFive()', function() {
    it('should return "complex one example all" when the value is "complex one &<example\nall"', function() {

    	var result = wordFilter.Filtering("complex one &<example\nall");

      assert.equal("complex one example all", result);
    });
  });



});
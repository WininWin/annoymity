/*! anonymity 18-11-2016 */
var wordFilter=function(){function a(a){return a=a.replace(/&/g,"&amp"),a=a.replace(/</g,"&lt"),a=a.replace(/>/g,"&gt"),a=a.replace(/\s\s+/g," "),a=a.replace(/\r?\n|\r/g," "),a+" / "}return{Filtering:function(b){return a(b)}}}();module.exports=wordFilter;
"use strict";
var fs = require('fs');

module.exports = function(name){
	var path = __dirname+'/defs/';
	var scripts = fs.readdirSync(path);
	var res = {};
	scripts.forEach(_load);
	function _load(filename){
		var fn = require(path+filename);
		var key = Object.keys(fn)[0];
		res[key] = fn;
	}
	return res[name];
}
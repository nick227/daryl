"use strict";
var fs = require('fs');

module.exports = {
	load:function(name){
		console.log("req:"+name);
		var obj = require('./'+name+'.js');
		return obj;
	}
}
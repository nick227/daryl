"use strict";
var fs = require('fs');

module.exports = {
	load:function(name){
		var obj = require('./'+name+'.js');
		return obj;
	}
}
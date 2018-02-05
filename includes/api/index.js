'use strict';

var map = require('./map.js');

module.exports.load = function(name, params){
	var def = map(name)[name]();
	var api = def.load(params);
	return api;
}
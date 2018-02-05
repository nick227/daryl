"use strict";
var _ = require('underscore');
var run = require('./run.js');
var update = require('./update.js');
var request = require('./request.js');

var fnList = {
	run:run,
	update:update,
	request:request
};

var handler = function(socket){
	var keys = Object.keys(fnList);
	_.each(keys, function(key){
		socket.on(key, function(msg){
			fnList[key](socket, msg);
		});
	})
}

module.exports = handler;
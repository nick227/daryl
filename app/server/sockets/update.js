"use strict";
var io = require('socket.io');
var db = require('../db/mongodb.js');
var mongo = new db('localfu', 'Jobs');

module.exports = function(socket, params){

var payload = {_id:params.id, query:params.query};

	var mongo = new db(params.type, params.name);
	mongo.save(payload, finished);

	function finished(res){
			socket.emit('alert',{msg:res});
	}
}
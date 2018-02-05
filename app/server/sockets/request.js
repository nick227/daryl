"use strict";
var io = require('socket.io');
var map = require('./map.js'); 
var db = require('../db/mongodb.js');
var mongo = new db('localfu', 'Jobs');

module.exports = function(socket, params){
	var type = params.type;
	var mongo = new db(map[type].db, map[type].collection);
	mongo.find({where:params.query}).then(function(res){
			socket.emit('response',res);
	});
}

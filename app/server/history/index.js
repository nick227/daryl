"use strict";
var db = require('../db/mongodb.js');
var user = require('../user');
class history{
	constructor(collectionName){
		this.db = new db('localfu', collectionName+'-history');
		this.log = [];
	}
	add(str){
		this.log.push(str);
	}
	save(obj){
		var history = this;
		var timestamp = Date.now();
		var params = {
			object_id:obj.id,
			name:obj.name,
			type:obj.type,
			duration:timestamp-obj.startTime,
			status:obj.status,
			user_id:user.id,
			timestamp:timestamp,
			log:history.log
		};
		history.db.save(params);
	}
}
module.exports = history;
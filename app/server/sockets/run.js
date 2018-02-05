"use strict";
var io = require('socket.io');
var db = require('../db/mongodb.js');
var mongo = new db('localfu', 'Jobs');
var Job = require('../jobs/Job.js');




module.exports = function(socket, id){

		function notify(msg){
			var job = this;
			socket.emit('msg',{id:job.id, params:JSON.stringify(msg)});
		}
		function finished(id){
			mongo.find({where:{_id:id}}).then(function(res){
				socket.emit('update', {id:res[0]._id, params:res[0]});
				socket.broadcast.emit('update', {id:res[0]._id, params:res[0]});
		   	});

		}
		var newjob = new Job(id, notify);
			//newjob.set({notify:notify});
			newjob.run()
		   		  .then(function(res){
		   		  	finished(id);
		    	  });
		}
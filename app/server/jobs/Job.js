"use strict";
var _ = require('underscore');
var tasks = require('./tasks');
var async = require('async');
var path = require('path');
var db = require('../db/mongodb.js');
var history = require('../history');
var WatchJS = require("watchjs")
var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;
var callWatchers = WatchJS.callWatchers;
var sleep = require('sleep');

class Job{
	constructor(id, notify=function(){return null;}){
		this.id = id,
		this.notify = notify,
		this.history = new history('Jobs'),
		this.db = new db('localfu', 'Jobs'),
		this.tasks = [],
		this.queue = [],
		this.params = [],
		this.step = 0,
		this.startTime = null,
		this.timer = 0,
		this.log = null,
		this.msg = null,
		this.status = null;
		this.name = null,
		this.type = null,
		this.delay = null;

	    return this;
	}
	run(){
		var job = this;
		job.status = 'running';
		return new Promise(function(finished,reject){
			job.load()
			   .then(function(){
	    			watch(job, job.watcher, 0, true);
					job.execute().then(function(res){
						finished(res);
					}, function(e){
						reject(e);
					});
			});
		})
	}
	load(){
		var job = this;
		return new Promise(function(finished, reject){
			var id = new job.db.ObjectID(job.id);
			job.db.find({where:{_id:id}}).then(function(res){
				var row = res[0];
				console.log("RES:");
				console.log(res);
				var startTime = Date.now() - row.frequency;
				var params = {
					startDate:startTime, 
					endDate:Date.now()
					}
				job.type = row.type;
				job.name = row.name;
				job.delay = row.delay || 0;
				job.params = _.defaults(params, {});
				job.tasks = tasks.load(job.name);

				finished(job);
			});
		});
	}
	execute(){
		var job = this;
		var tasks = this.tasks;
		job.startTime = Date.now();
		_.forEach(tasks, function(task, key){
			job.queue.push(function(){
				job.timer = (Date.now() - job.startTime)/1000;
				var next = callbackFind(arguments);
				var arg = paramFind(arguments);
				try{
				task.apply(job, [arg]).then(function(res){
        			//job.step++;
        			job.msg = "sleep "+job.delay;
		        	sleep.sleep(job.delay);
					next(null, res);
				})
			}catch(e){
				job.error(e);
			}
			});
		});
		return new Promise(function(finished,reject){
			async.waterfall(job.queue, function(res){
				job.timer = (Date.now() - job.startTime)/1000;
				job.status = 'finished';
				job.status = 'ready';
				job.endMessage = '-------------------';
				unwatch(job);
				job.timestamp(Date.now());
				job.history.save(job);
				finished(res);
			});
		});
	}
	watcher(prop, action, val, prevVal){
			var job = this;
	    	var obj = {};
	    	obj[prop]=val;
	    	if(typeof prop === 'string' && typeof val !== 'object'){
	    		if(prop==='log'){
	    			job.history.add(val);
	    		}
	    		console.log(obj);
	    		job.notify(obj);
	    	}
	}
	timestamp(timestamp){
		var job = this;
    	return new Promise(function(res,rej){
	        var mongo = job.db;//todo: move up
	        mongo.save({"_id":job.id, "query":{$set:{"lastRun":timestamp}}}, res);
    	});
	}
	error(msg){
		var job = this;
		job.msg = msg;
	}
}

function callbackFind(obj){
	return _.find(obj, function(item){return typeof item === 'function'});
}
function paramFind(obj){
	return _.find(obj, function(item){return typeof item !== 'function'});
}

module.exports = Job;
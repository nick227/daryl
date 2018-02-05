"use strict";
var _ = require('underscore');
var tasks = require('./tasks');
var async = require('async');
var path = require('path');

var rootDir = path.dirname(require.main.filename);
var includesPath = path.relative(__dirname, rootDir).replace(/\\/g, '/')+'/includes';
var db = require(includesPath+'/db/mongodb.js');
///var sleep = require('sleep');

class Job{
	constructor(params){
		this.id = params.id;
		this.type = params.type;
		this.name = params.name;
		this.params = _.defaults(params, {
			delay:.5 //seconds
		});
		this.tasks = tasks.load(params.name);
		this.step = 0;
		this.startTime = 0;
		this.runningTime = 0;
	}
	run(){
		var tasks = this.tasks;
		var queue = [];
		var job = this;
		job.startTime = Date.now();

		_.forEach(tasks, function(task, key){
			queue.push(function(){
				var next = callbackFind(arguments);
				var arg = paramFind(arguments);
				task.apply(job, [arg]).then(function(res){
        			job.step++;
					job.runningTime = (Date.now() - job.startTime)/1000;
					console.log("job.runningTime: "+job.runningTime);
					/*
					var delay = job.params.delay;
		        	sleep.sleep(delay);
		        	*/
					next(null, res);
				})
			});
		});

		return new Promise(function(finished,reject){

			async.waterfall(queue, function(res){
				console.log("\n");
				job.runningTime = (Date.now() - job.startTime)/1000;
				console.log("job.finished time: "+job.runningTime);
				console.log("------------------");
				console.log("WATERFALL DONE");
				console.log("------------------");
				finished(res);
			});
		
		});
	}
	timestamp(timestamp){
		var job = this;
    	return new Promise(function(res,rej){
	        var mongo = new db('Jobs', this.type);
	        mongo.save({"_id":job.id, "query":{$set:{"lastRun":timestamp}}}, res);
    	});
	}
}
function callbackFind(obj){
	return _.find(obj, function(item){return typeof item === 'function'});
}
function paramFind(obj){
	return _.find(obj, function(item){return typeof item !== 'function'});
}

/*
var Scraper = require("./scraper.js");
var mongodb = require("./db/mongodb.js");

jobs.db = mongodb;
jobs.scrape = Scraper.scrape;
*/

module.exports = Job;
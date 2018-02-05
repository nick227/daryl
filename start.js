var colors = require('colors/safe');
var prompt = require('prompt');
var moment = require('moment');
var async = require('async');
var _ = require('underscore');

var Job = require('./includes/jobs/Job.js');
var day = 1000 * 60 * 60 * 24;
var params = {
				startDate:Date.now()-day*1, 
				endDate:Date.now(),
				id:"57edc68f03f49a17c7413493",
				name:'do512-page',
				type:'scraper'
			}
var do512_job = new Job(params);
do512_job.run()
		 .then(function(res){
		 	console.log("all done bro.");
});
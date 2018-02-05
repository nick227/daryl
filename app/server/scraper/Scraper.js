"use strict";
var _ = require('underscore');
var cheerio = require('cheerio');
var async = require('async');
var request = require('request');
var path = require('path');

var userAgents = require('../constants/userAgentsList.js');
var proxies = require('../constants/proxyList.js');
var db = require('../db/mongodb.js');

var filters = require('./cheerio-filters/load.js');
var sleep = require('sleep');

class Scraper{
	constructor(job, opts={}){
		this.job = job;
		this.save = false;
		this.filter = filters.load(job.name);
		this.options = _.defaults(opts, {
            headers: {
                'proxy': proxies[Math.floor(Math.random() * proxies.length)],
                'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)]
            }
        });
	}
	scrape(urls){
		var scraper = this;
		var job = scraper.job;
		var delay = job.delay;
		return new Promise(function(finished, error){
			var tasks = [];
			var result = [];
			_.each(urls, function(url){
				tasks.push(function(next){
					scraper._request(url).then(function(html){
						job.msg = url;
						job.msg = 'sleep '+delay;
						sleep.sleep(delay);
		                var $ = cheerio.load(html);
		                var res = scraper.filter($, url);
		                if(scraper.save){
		                	var scrapings = new db('scrapings', job.name);
		                	scrapings.save(res, next);
		                }else{
		                	result.push(res);	
							next(null, res);
		                }
					}, function(err){
						job.log = err.toString();
						next(err);
					});
				});
			});
			async.series(tasks, function(res){
				finished(result);
			});
		})
	}
	_request(url){
		var scraper = this;
		var reqOptions = scraper.options;
		reqOptions.url = url;
		return new Promise(function(next, rej){
	        request(reqOptions, function(error, response, html) {
	            if (!error && response.statusCode == 200) {
	                next(html);
	            } else {
	                rej(error);
	            }
	        });
		});
	}
}


module.exports = Scraper;
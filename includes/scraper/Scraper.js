"use strict";
var _ = require('underscore');
var cheerio = require('cheerio');
var async = require('async');
var request = require('request');
var path = require('path');
var rootDir = path.dirname(require.main.filename);
var rootPath = path.relative(__dirname, rootDir).replace(/\\/g, '/');
var userAgents = require(rootPath+'/includes/constants/userAgentsList.js');
var proxies = require(rootPath+'/includes/constants/proxyList.js');

var filters = require('./cheerio-filters/load.js');
//var sleep = require('sleep');

class Scraper{
	constructor(opts, params){
		this.callback = params.callback;
		this.filter = filters.load(params.key);
		this.options = _.defaults(opts, {
            headers: {
                'proxy': proxies[Math.floor(Math.random() * proxies.length)],
                'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)]
            }
        });
	}
	scrape(params){
		var scraper = this;
		return new Promise(function(finished, error){
			var tasks = [];
			var result = [];
			_.each(params.urlList, function(url){
				tasks.push(function(next){
					scraper._request(url).then(function(html){
		                var $ = cheerio.load(html);
		                var res = scraper.filter($, url);
		                result.push(res);
						next(null, res);
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
	_log(data){
		console.log("logger");
		console.log(data);
	}
}


module.exports = Scraper;
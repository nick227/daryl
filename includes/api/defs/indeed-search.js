'use strict';

var _ = require('underscore');
var publicIp = require('public-ip');
module.exports.indeedSearch = function(){
/*
# node_modules/indeed-api
# https://api.indeed.com/ads
# Attribution: <span id=indeed_at><a href="http://www.indeed.com/">jobs</a> by <a href="http://www.indeed.com/" title="Job Search"><img src="http://www.indeed.com/p/jobsearch.gif" style="border: 0;vertical-align: middle;" alt="Indeed job search"></a></span><script type="text/javascript"src="http://gdc.indeed.com/ads/apiresults.js"></script>
*/
	return {
		fire:function(params, next){
			///todo: build better solution
			publicIp.v4().then(function(ip){
				var indeed = this._indeed;
				this._filter(params);
				var vars = this._vars;
				vars.ip = ip;
				indeed.JobSearch()
					  .Radius(vars.radius)
					  .WhereLocation(vars.where)
					  .Limit(vars.limit)
					  .WhereKeywords(vars.keywords)
					  .SortBy(vars.sortBy)
					  .UserIP(vars.ip)
					  .UserAgent(vars.useragent)
					  .Search(function(res){
					  	console.log("!!!!");
					  	console.log(res);
					  	next(res);
					  },function(e){
					  	next(e);
					  });
			});
		},
		load:function(){
			var indeedID = require('./private')['indeedID'];
			this._indeed = require('indeed-api').getInstance(indeedID);
			this._vars = {
				radius:25,
				limit:5,
				keywords:[],
				sortBy:'date',
				useragent:"Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36"
			};
			return this;
		},
		_filter:function(obj){
			var t = this;
			_.each(obj, function(item, key){
				t._vars.where[key] = item;
			});
		}
	}
}
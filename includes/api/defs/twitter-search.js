'use strict';

var _ = require('underscore');
module.exports.twitterSearch = function(){
/*
# node_modules/twitter-search
# www.twitterapis.com/customsearch/v1
*/
	return {
		fire:function(params, next){
			var twitter = this._twitter;
			var q = this._filter(params);
			twitter.search(q, function(e, res) {
			    if (e){
			        next(e);
			    }else{
			        next(res);
			    }
			});
		},
		load:function(){
			var Twitter = require('node-twitter');
			var twitterAuth = require('./private')['twitterAuth'];
			this._twitter = new Twitter.SearchClient(twitterAuth[0],twitterAuth[1],twitterAuth[2],twitterAuth[3]);
			return this;
		},
		_filter:function(obj){
			var q = _.map(obj, function(item){
				if(item.length){return item}
			}).join(" ");
			var params = {
				q:q
			};
			return params;
		}
	}
}
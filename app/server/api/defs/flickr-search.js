'use strict';

var _ = require('underscore');
module.exports.flickrSearch = function(){
/*
# node_modules/node-flickr
# https://api.flickr.com/services/rest/?
*/
	return {
		fire:function(params, next){
			var flickr = this._flickr;
			var q = this._filter(params);
			flickr.get("photos.search", q, function(e, res){
				if(e){
					console.log(e);
					next(e);
				}
				next(res);
			});
		},
		load:function(){
			var flickrAuth = require('./private')['flickrAuth'];
			var flickr = require('node-flickr');
			var key = {api_key:flickrAuth.key};
			flickr = new flickr(key);
			this._flickr = flickr;
			return this;
		},
		_filter:function(params){
			var q = _.map(params, function(item){
				if(item.length){return item}
			}).join(", ");

			return {"tags":q};
		}
	}
}
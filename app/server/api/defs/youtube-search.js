'use strict';

var _ = require('underscore');
module.exports.youtubeSearch = function(){
/*
# node_modules/youtube-node
# https://www.googleapis.com/youtube/v3/
*/
	return {
		fire:function(params, next){
			var youtube = this._youtube;
			var q = this._filter(params);
			var max = this.max;
			youtube.search(q, max, function(e, res){
				if(e){
					console.log(e);
					next(e);
				}
				next(res);
			});
		},
		load:function(){
			var youtube = require('youtube-node');
			youtube = new youtube();
			var key = require('./private')['youtubeKey'];
			youtube.setKey(key);
			this._youtube = youtube;
			this.max = 10;
			return this;
		},
		_filter:function(param){
			if(typeof param === 'string'){
				return param;
			}
			var t = this;
			var q = _.map(param, function(item, key){
				if(key==='max'){
					t.max = item;
				}
				if(item.length && key !== 'max'){return item}
			}).join(", ");

			return q;
		}
	}
}
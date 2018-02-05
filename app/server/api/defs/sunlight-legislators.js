'use strict';

var _ = require('underscore');
module.exports.sunlightLegislators = function(){
/*
# node_modules/sunlight
# https://www.googleapis.com/sunlight/v2/representatives
*/
	return {
		fire:function(params, next){
			var sunlight = this._sunlight;
			var q = this._filter(params);
			sunlight.legislators.allForZip(q, function(res){
				console.log(res);
				console.log("-----");
			  	next(data);
			}, function(err){
			  	next(err);
			});
		},
		load:function(){
			var key = require('./private')['sunlightKey'];
			var SunlightClient = require('sunlight').SunlightClient;
			this._sunlight = new SunlightClient(key);
			return this;
		},
		_filter:function(str){
			return str;
		}
	}
}





'use strict';

var _ = require('underscore');
module.exports.meetupCity = function(){
/*
# node_modules/meetup-api
#
*/
	return {
		fire:function(params, next){
			var meetup = this._meetup;
			var q = this._filter(params);
			meetup.getLocations({'query': 'austin tx'}, function(e, res){
				if(e){console.log("error:"+e);}
				console.log(res);
				next(res);
			});
		},
		load:function(){
			var key = require('./private')['meetupKey'];
			this._meetup = require('meetup-api')({key: key});
			return this;
		},
		_filter:function(param){
			return param;
		}
	}
}
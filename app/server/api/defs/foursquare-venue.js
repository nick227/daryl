'use strict';

var _ = require('underscore');
module.exports.foursquareVenue = function(){
/*
# node_modules/node-foursquare-venues
# https://api.foursquare.com/v2
*/
	return {
		fire:function(params, next){
			var foursquare = this._foursquare;
			var q = this._filter(params);
			q.limit = this._limit;
			foursquare.venues.search(q, function(e, res) {
			    if (e){
			        next(e);
			    }else{
			        next(res);
			    }
			});
		},
		load:function(){
			var foursquareAuth = require('./private')['foursquareConfig'];
			this._limit = 5;
			this._foursquare = require('node-foursquare-venues')(foursquareAuth.id, foursquareAuth.secret);
			return this;
		},
		_filter:function(obj){
			if(obj.limit){this._limit=obj.limit;}
			return obj;
		}
	}
}
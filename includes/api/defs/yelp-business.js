'use strict';
var _ = require('underscore');

module.exports.yelpBusiness = function(){
/*
# http://api.yelp.com/v2/business/
*/
	return {
		fire:function(params, next){
			var yelp = this._yelp;
			var q = this._filter(params);
			yelp.business(q).then(function(res){
			  	next(res);
			}, function(e){
				next(e);
			});
		},
		load:function(){
			var yelpKey = require('./private')['yelpBusiness'];
			var Yelp = require('yelp');
			this._yelp = new Yelp(yelpKey);
			return this;
		},
		_filter:function(obj){
			var q = _.map(obj, function(item){
				if(item.length){return encodeURIComponent(item)}
			}).join("-");
			return q;
		}

	}
}
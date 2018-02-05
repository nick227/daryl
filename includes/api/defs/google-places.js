'use strict';
var _ = require('underscore');
module.exports.googlePlaces = function(){
/*
# maps.googleapis.com/maps/api/place/textsearch/
# maps.googleapis.com/maps/api/place/details/
*/
	return {
		fire:function(params, next){
			var google = this._google;
			var q = this._filter(params);
			google.textSearch(q, function(e,res){
				if(res.results.length && res.status==='OK'){
					var params = {
						placeid:res.results[0].place_id
					}
					google.placeDetailsRequest(params, function(e,r){
						next(r);
					});
				}else{
					next(res);
				}
			});
		},
		load:function(){
			var googleKey = require('./private')['googleKey'];
			var GooglePlaces = require('googleplaces');
			this._google = GooglePlaces(googleKey, "json");
			return this;
		},
		_filter:function(obj){
			var q = _.map(obj, function(item){
				if(item.length){return item}
			}).join(" ");
			var params = {
				query:q
			};
			return params;
		}

	}
}
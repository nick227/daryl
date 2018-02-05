'use strict';

module.exports.instagramLocation = function(){
/*
# http://api.instagram.com/locations/search
# Accepts lat/lon
*/
	return {
		fire:function(params, next){
			var instagram = this._instagram;
			var q = this._filter(params);
			instagram.searchLocations(q).then(function(result) {
				var locationID = result.data[0].id;
					next(result);

			}, function(err){ 
			   next(err);
			});
		},
		load:function(){
			var InstagramAPI = require('instagram-api');
			var accessToken = require('./private')['instagramToken'];
			this._instagram = new InstagramAPI(accessToken);
			return this;
		},
		_filter:function(obj){
			obj.distance = 1000;
			return obj;
		}

	}
}
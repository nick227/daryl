'use strict';

var _ = require('underscore');
module.exports.locuVenue = function(){
/*
# node_modules/locu
# https://api.locu.com
*/
	return {
		fire:function(params, next){
			var locu = this._locu;
			var q = this._filter(params);
			locu.search(q, function(res){
				next(res);
			});
		},
		load:function(params){
			var locuID = require('./private')['locuKeys'].api;
			var locu = require('locu');
			this._locu = new locu.VenueClient(locuID);
			return this;
		},
		_filter:function(obj){
			obj.fields = ["name", "description", "contact", "categories", "menus", "extended", "location"];
			return obj;
		}
	}
}
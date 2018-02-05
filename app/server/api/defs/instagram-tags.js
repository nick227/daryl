'use strict';

var _ = require('underscore');
module.exports.instagramTags = function(){
/*
# node_modules/instagram-search
# www.instagramapis.com/customsearch/v1
*/
	return {
		fire:function(params, next){
			var instagram = this._instagram;
			var q = this._filter(params);

			instagram.searchTags(q).then(function(res) {
				next(res);
			}, function(e){
			    next(e);
			});
		},
		load:function(){
			var InstagramAPI = require('instagram-api');
			var accessToken = require('./private')['instagramToken'];
			this._instagram = new InstagramAPI(accessToken);
			return this;
		},
		_filter:function(obj){
			var q = _.map(obj, function(item){
				if(item.length){return item}
			}).join(" ");
			return q;
		}
	}
}
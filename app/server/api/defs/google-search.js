'use strict';

var _ = require('underscore');
module.exports.googleSearch = function(){
/*
# node_modules/google-search
# www.googleapis.com/customsearch/v1
*/
	return {
		fire:function(params, next){
			var google = this._google;
			var q = this._filter(params);
			google.build(q, function(e, res) {
			  next(res);
			});
		},
		load:function(){
			var googleKey = require('./private')['googleKey'];
			var googleCX = require('./private')['googleCX'];
			var GoogleSearch = require('google-search');
			this._google = new GoogleSearch({
			  key: googleKey,
			  cx: googleCX
			});
			return this;
		},
		_filter:function(obj){
			var q = _.map(obj, function(item){
				if(item.length){return item}
			}).join(" ");
			var params = {
				q:q,
				num:10
			};
			return params;
		}
	}
}
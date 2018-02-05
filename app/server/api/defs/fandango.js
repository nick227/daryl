'use strict';

var _ = require('underscore');
module.exports.fandango = function(){
/*
# node_modules/findango-api
# http://www.fandango.com/rss/moviesnearme_
*/
	return {
		fire:function(params, next){
			var fandango = this._fandango;
			var q = this._filter(params);
			fandango.find(q).then(function(res){
				next(res);
			});
		},
		load:function(){
			this._fandango = require('findango-api');
			return this;
		},
		_filter:function(param){
			return {zipCode:param.zip};
		}
	}
}
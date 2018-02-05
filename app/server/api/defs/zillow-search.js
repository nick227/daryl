'use strict';

var _ = require('underscore');
module.exports.zillowSearch = function(){
/*
# node_modules/node-zillow
# https://zillow.com/webservice/
*/
	return {
		fire:function(params, next){
			var zillow = this._zillow;
			var q = this._filter(params);
			var data = zillow.get('GetDemographics', q);
			data.then(function(res){
				next(res);
			});
		},
		load:function(){
			var Zillow   = require('node-zillow');
			var zillowID = require('./private')['zillowID'];
			this._zillow = new Zillow(zillowID);
			return this;
		},
		_filter:function(params){
			return params;
		}
	}
}
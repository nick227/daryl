'use strict';

var _ = require('underscore');
module.exports.civicRepresentatives = function(){
/*
# node_modules/civic-info
# https://www.googleapis.com/civicinfo/v2/representatives
*/
	return {
		fire:function(params, next){
			var civicInfo = this._civicInfo;
			var q = this._filter(params);
			civicInfo.representatives(q, function(error, data) {
			  	next(data);
			}, function(err){
			  	next(err);
			});
		},
		load:function(){
			var civicInfoKey = require('./private')['googleCivicInfoKey'];
			this._civicInfo = require("civic-info")(civicInfoKey);
			return this;
		},
		_filter:function(obj){
			obj = _.defaults(obj, {
				includeOffices: true,
				recursive: true,
				levels: ['locality','administrativeArea1', 'administrativeArea2'],
				roles: ["deputyHeadOfGovernment", "executiveCouncil", "governmentOfficer", "headOfGovernment", "headOfState", "highestCourtJudge", "judge", "legislatorLowerBody", "legislatorUpperBody", "schoolBoard", "specialPurposeOfficer"]
  			});
			return obj;
		}
	}
}





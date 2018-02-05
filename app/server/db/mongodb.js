"use strict";

var async = require('async');
var _ = require('underscore');
var Db = require('mongodb');
/*
# class MongoDBHelper
# 	constructor(collectionName, dbName) requires collection and db name
# 	save(obj, callback) requires obj or list of mongo json
# 	save(obj, callback) requires callback - passes error
# 	find(vars) accepts mongo query json 
*/
class MongoDBHelper{
	constructor(dbName, collectionName){
		this.collectionName = collectionName;
		this.dbName = dbName;
		this.db = function (){return require('monk')('localhost/'+this.dbName);}
    	this.ObjectID = Db.ObjectID;
		this.params = {
			limit:0,
			where:{},
			skip:0,
			sort:{"_id":1},
			collection:this.collectionName
			};
		return this;
	}
	save(obj, callback){
		var db = this.db(),
		table = db.get(this.collectionName);
		if(Array.isArray(obj)){
			var tasks = [];
			for(var i in obj){
				var data = obj[i];
				tasks.push(function(next){
					write(data).then(function(res, err){
						next(err);
					});
				});
				async.series(tasks, function(err){
					db.close();
					callback(err);
				});
			}
		}else{
			write(obj).then(function(res, err){
				db.close();
				callback(err);
			});
		}
		function write(payload){
			return new Promise(function(resolve,reject){
				const options = {
					upsert:true
				};
				if(typeof payload._id !== 'undefined'){
					var params = {"_id":payload._id};
					var query = payload.query;
				}else{
					var params = payload;
					var query = params;
				}
				table.update(params, query, options, function(err, num, res){
					if(err) {
						reject(err);
					}else{
						resolve(res);
					}
				});
			})

		}

	}
	find(vars){
		var db = this.db();
		var params = _.defaults(vars, this.params);
		console.log("****************>>");
		console.log(params);
		return new Promise(function(resolve,reject){
			db.get(params.collection).find(params.where, {limit:params.limit, sort:params.sort, skip:params.skip}).then(function(res, e){
				db.close();
				resolve(res);
			});

		});

	}
	distinct(vars){
		var db = this.db();
		var params = _.defaults(vars, this.params);
		return new Promise(function(resolve,reject){
			db.get(params.collection).distinct(params.unique, params.where).then(function(res, e){
				if(e){reject(e)};
				db.close();
				resolve(res);
			});
			
		});
	}
}
module.exports = MongoDBHelper;
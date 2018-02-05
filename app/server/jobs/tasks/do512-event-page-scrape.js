"use strict";

var async = require('async');
var _ = require('underscore');
var moment = require('moment');
var path = require('path');

var db = require('../../db/mongodb.js');
var Scraper = require('../../scraper/Scraper.js');
var tools = require('./tools.js');
var base_url = "http://do512.com";
var parentJob = 'do512-index-scrape';
var tasks = [];

/***********************
# push operation into tasks
# return promise
**********************/
tasks.push(function(){
    var job = this;
    job.log = 'get urls';
    return new Promise(function(res,rej){
        var mongo = new db('scrapings',parentJob);
        var params = {
            where:{
             scraped: {$ne:true}
            }
        };
        mongo.find(params).then(function(data){
            job.params.hrefList = _.pluck(data, 'href').map(function(str){return base_url+str});
            job.params.idList = _.pluck(data, '_id');
            job.log = '# urls: '+job.params.hrefList.length;
            res(null);
        });
    });
});
/*/////////////////////////*/
tasks.push(function(){
    var job = this;
    job.log = 'start scraping';
    return new Promise(function(res,rej){
        var scraper = new Scraper(job);
        scraper.save = true;
        var urls = job.params.hrefList;
        scraper.scrape(urls)
               .then(function(response){
                   res(response);
              });
    });
});
/*/////////////////////////
tasks.push(function(data){
    var job = this;
    job.log = 'save results to mongo';
    return new Promise(function(res,rej){
        var mongo = new db('scrapings',job.name);
        var d = _.flatten(data);
        job.log = '# rows: '+d.length;
        mongo.save(d, res);
    });
});
/////////////////////////*/
tasks.push(function(){
    var job = this;
    job.log = 'update original';
    return new Promise(function(res,rej){
        var mongo = new db('scrapings',parentJob);
        var d = _.map(job.params.idList, function(id){
            return {_id:id,query:{$set:{scraped:true}}}
        });
        job.log = '# rows: '+d.length;
        mongo.save(d, res);
    });
});
/*/////////////////////////*/
tasks.push(function(err){
    var job = this;
    job.log = 'update timestamp';
    return new Promise(function(res,rej){
        if(err){
            console.log(err);
            rej(err);
        }else{
            var timestamp = Date.now();
            job.timestamp(timestamp).then(function(err){
                if(err) rej(err);
                res(null);
            });
        }
    });
});
/*/////////////////////////*/
module.exports = tasks;
"use strict";

var async = require('async');
var _ = require('underscore');
var moment = require('moment');
var path = require('path');

var rootDir = path.dirname(require.main.filename);
var includesPath = path.relative(__dirname, rootDir).replace(/\\/g, '/')+'/includes';

var db = require(includesPath+'/db/mongodb.js');
var Scraper = require(includesPath+'/scraper/Scraper.js');
var tools = require('./tools.js');
var base_site = "http://do512.com";
var base_url = "http://do512.com/events/";
var tasks = [];

/***********************
# push operation into tasks
# return promise
**********************/
tasks.push(function(){
    //generate urls
    var job = this;
    return new Promise(function(res,rej){
        var startDate = job.params.startDate;
        var endDate = job.params.endDate;
        job.params.urlList = tools.urlFactory(base_url, startDate, endDate);
        res(null);
    });
});
/***********************/
tasks.push(function(){
    //scrape pages
    var job = this;
    return new Promise(function(res,rej){
        var scraper = new Scraper({}, {key:'do512-index'});
        var urlList = job.params.urlList;
        var params = {
            delay:1,
            urlList:urlList
        };
        scraper.scrape(params)
               .then(function(response){
                    res(response);
               });
    });
});
/***********************/
tasks.push(function(data){
    //save results to mongo
    return new Promise(function(res,rej){
        var mongo = new db('do512-index');
        var d = _.flatten(data);
        mongo.save(d, res);
    });
});
/***********************/
tasks.push(function(err){
    var job = this;
    return new Promise(function(res,rej){
        if(err){
            console.log(err);
            rej(err);
        }else{
            var timestamp = Date.now();
            job.timestamp(timestamp).then(function(err){
                if(err) rej(err);
                res(true);
            });
        }
    });
});
/***********************/





/** ^-^ ** ^-^ ** ^-^ ** ^-^ ** ^-^ ** ^-^ ** ^-^ ** ^-^ ** ^-^ ** ^-^ ** ^-^ **
                                                                        @('_')@                                       
** ^-^ ** ^-^ ** ^-^ ** ^-^ ** ^-^ ** ^-^ ** ^-^ ** ^-^ ** ^-^ ** ^-^ ** ^-^ **/

module.exports = tasks;
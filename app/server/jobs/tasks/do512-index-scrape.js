"use strict";

var async = require('async');
var _ = require('underscore');
var moment = require('moment');
var path = require('path');

var db = require('../../db/mongodb.js');
var Scraper = require('../../scraper/Scraper.js');
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
    job.log = 'generate urls';
    return new Promise(function(res,rej){
        var startDate = job.params.startDate;
        var endDate = job.params.endDate;
        job.params.urlList = tools.urlFactory(base_url, startDate, endDate);
        var params = {
            where:{
                url:{$in:job.params.urlList}
            }
        };
        var mongo = new db('scrapings', job.name);
        mongo.find(params).then(function(data){
            var urlCheck = _.pluck(data, 'url');
            urlCheck = _.uniq(urlCheck, function(url){return url;});
            job.params.urlList = _.difference(job.params.urlList, urlCheck);
            job.log = 'urls: '+job.params.urlList.length;
            res(null);
        });
    })

});
/********************************************/

tasks.push(function(){
    //scrape pages
    var job = this;
    return new Promise(function(res,rej){
        var scraper = new Scraper(job);
        var urlList = job.params.urlList;
        job.log = 'scrape pages';
        job.log = urlList.length + ' pages';
        var params = {
            delay:job.delay,
            urlList:urlList
        };
        scraper.scrape(params)
               .then(function(response){
                    res(response);
               });
    });
});
/********************************************/

tasks.push(function(data){
    var job = this;
    job.log = 'save results to mongo';
    return new Promise(function(res,rej){
        var mongo = new db('scrapings',job.name);
        var d = _.flatten(data);
        job.log = 'rows: '+d.length;
        if(!data.length){
            res(null);
        }
        mongo.save(d, res);
    });
});



/** ^-^ ** ^-^ ** ^-^ ** ^-^ ** ^-^ ** ^-^ ** ^-^ ** ^-^ ** ^-^ ** ^-^ ** ^-^ **
                                                                        @('_')@                                       
** ^-^ ** ^-^ ** ^-^ ** ^-^ ** ^-^ ** ^-^ ** ^-^ ** ^-^ ** ^-^ ** ^-^ ** ^-^ **/

module.exports = tasks;
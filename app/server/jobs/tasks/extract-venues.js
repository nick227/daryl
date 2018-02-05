"use strict";

var async = require('async');
var _ = require('underscore');
var moment = require('moment');
var path = require('path');

var db = require('../../db/mongodb.js');
var Scraper = require('../../scraper/Scraper.js');
var tools = require('./tools.js');
var APIs = require('./');
var tasks = [];

/***********************
# push operation into tasks
# return promise
**********************/
tasks.push(function(){
    var job = this;
    job.log = 'Extract Venues';
    return new Promise(function(res,rej){
        var scrapings = new db('scrapings', 'do512-event-page-scrape');
        scrapings.distinct({unique:'venue', where:{extracted:{$ne:true}}}).then(function(data){
            res(data);
        });
    });
});
tasks.push(function(data){
    var job = this;
    job.log = 'Existing Venue Check';
    return new Promise(function(res,rej){
        var params = {where:{name:{$in:data}}};
        var venues = new db('venues', 'austin');
        venues.find(params).then(function(existingVenues){
            existingVenues = _.pluck(existingVenues, 'name');
            var results = _.difference(data, existingVenues);
            res(results);
        });
    });
});
tasks.push(function(data){
    var job = this;
    job.log = 'Save venues';
    return new Promise(function (res,rej) {
        var venues = new db('venues', 'austin');
        var params = _.map(venues, function(venue){
            return {'name':venue, createDate:Date.now(), city:'austin'};
        });
        venues.save(params, res);

    });
});    



module.exports = tasks;
"use strict";

var async = require('async');
var _ = require('underscore');
var moment = require('moment');
var path = require('path');

var db = require('../../db/mongodb.js');
var Scraper = require('../../scraper/Scraper.js');
var tools = require('./tools.js');
var tasks = [];

/***********************
# push operation into tasks
# return promise
**********************/
tasks.push(function(){
    var job = this;
    job.log = 'task name';
    return new Promise(function(res,rej){
        /* task code */
        res(null);
    });
});


module.exports = tasks;
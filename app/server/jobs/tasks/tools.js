"use strict";

var moment = require('moment');
var db = require('../../db/mongodb.js');

function urlFactory(base_url, startDate, endDate){
    var res = [];
    var runningDate = moment(startDate).valueOf();
    startDate = moment(startDate).valueOf();
    endDate = moment(endDate).valueOf();
    while(runningDate != endDate && runningDate < endDate){
        runningDate = moment(runningDate).add(1,'d').valueOf();
        var row = base_url+moment(runningDate).format("YYYY/M/D");
        res.push(row);
    }
    return res;
}
module.exports = {
    urlFactory:urlFactory
};
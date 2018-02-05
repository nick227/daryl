"use strict";

/**
# $ is Cheerio html obj
# set "type" attribute
# variable names will be field names in mongo
# return obj
**/
var tools = require('./tools.js');
module.exports = function($, url){
	var res = [], obj = {};
    $('.ds-events-group .ds-listing').each(function(e,i){
    	var type = "do512-index";
    	var title = $(this).find('.ds-listing-event-title-text').html();
    	var coverImg = $(this).find('.ds-cover-image');
    	var imgURL = tools.getBgUrl(coverImg.attr('style'));
    	var link = $(this).find('.url').attr('href');
    	obj = {title:title, href:link, artwork:imgURL, status:0, type:type, url:url, status:'new'};
    	res.push(obj);
    });
    return res;
}
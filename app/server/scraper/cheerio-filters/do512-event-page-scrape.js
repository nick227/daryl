"use strict";

/**
# $ is Cheerio html obj
# set "type" attribute
# variable names will be field names in mongo
# return obj
**/
var tools = require('./tools.js');
module.exports = function($, url){
    var obj = {
        type:"event-page",
        city:"austin",
        state:"tx",
        site:'do512.com',
        status:1,
        title    :$('.ds-event-title-text').html(),
        venue    :$('.ds-venue-name span[itemprop=name]').html(),
        venueLink:'do512.com/' + $('.ds-venue-name a[itemprop=url]').attr('href'),
        startDate:$('.ds-event-meta meta[itemprop=startDate]').attr('content'),
        endDate  :$('.ds-event-meta meta[itemprop=endDate]').attr('content'),
        poster   :$('.ds-feed-poster-image img[itemprop=image]').attr('src'),
        info     :$('.ds-ticket-info').html(),
        byline   :$('.byLine').html(),
        artwork   :tools.getBgUrl($('.ds-cover-image').attr('style')),
        eventDate:tools.cleanPastDate($('.ds-event-date').html()),
        body     :tools.stripHTML($('.ds-event-description-inner').html()),
        artists  :$('.ds-title a span[itemprop=name]').map(function(i,el){
                        return $(this).text().toString();
                    }).get().join(', ')
    }
    return obj;
}
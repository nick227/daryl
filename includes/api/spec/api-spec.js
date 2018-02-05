'use strict';

var _ = require('underscore');
var api = require('../api');
jasmine.getEnv().defaultTimeoutInterval = 5555;
var bunyan = require('bunyan');

var testData = [{
/* #meetupCity  ************/
	active:true,
	msg:'meetup city search',
	fnName:'meetupCity',
	params:{lat: 30.269097,lon: -97.7722281,country: 'US'}
	},{
/* #civicRepresentatives  ************/
	active:false,
	msg:'civicInfo rep search address',
	fnName:'civicRepresentatives',
	params:{address: '1822 S. Congress Ave. Austin TX'}
	},{
/* #locuVenue  ************/
	active:false,
	msg:'locu venue search should find dans hamburgers',
	fnName:'locuVenue',
	params:{address: '1822 S. Congress Ave. Austin TX'}
	},{
/* #yelpBusiness  ************/
	active:false,
	msg:'yelp business search should find Barflys',
	fnName:'yelpBusiness',
	params:{
			venue: "Barflys",
			city: 'Austin'
		}
	},{
/* #googleSearch  ************/
	active:false,
	msg:'google search should find Bob Schneider results',
	fnName:'googleSearch',
	params:{term:'Bob Schneider'}
	},{
/* #googlePlaces  ************/
	active:false,
	msg:'google places should find UT Austin',
	fnName:'googlePlaces',
	params:{
			venue: 'University of Texas',
			city: 'Austin',
			address: '110 Inner Campus Drive Austin, TX 78705'
			}
	},{
/* #foursquareVenue  ************/
	active:false,
	msg:'foursquare should find zilker park',
	fnName:'foursquareVenue',
	params:{
			ll: '30.269097,-97.7722281',
			query: 'zilker park',
			limit: 1//max 50
			}
	},{
/* #zillowSearch  ************/
	active:false,
	msg:'zillow should find 78701',
	fnName:'zillowSearch',
	params:{zip:78727}
	},{
/* #fandango  ************/
	active:false,
	msg:'fandango should find 78701',
	fnName:'fandango',
	params:{zip:78727}
	},{
/* #youtubeSearch  ************/
	active:false,
	msg:'youtube should find downtown austin',
	fnName:'youtubeSearch',
	params:{term:'downtown austin', max:3}
	},{
/* #flickrSearch  ************/
	active:false,
	msg:'flickr should find austin photos',
	fnName:'flickrSearch',
	params:{city:'austin'}
	},{
/* #indeedSearch ERROR KEEPS TIMING OUT 
	active:false,
	msg:'indeed search should find dallas indeed.com jobs',
	fnName:'indeedSearch',
	params:{
		city:"Dallas",
		state:"TX"
		}
	} ,{************/
/* #instagramLocation  ************/
	active:false,
	msg:'instagram location search should find zilker',
	fnName:'instagramLocation',
	params:{lat:30.269097, lng:-97.7722281}
	},{
/* #instagramTags  ************/
	active:false,
	msg:'instagram tag search should find austin tx',
	fnName:'instagramTags',
	params:{term:'austin tx'}
	},{
/* #twitterSearch  ************/
	active:false,
	msg:'twitter search should find McDonalds',
	fnName:'twitterSearch',
	params:{term:'McDonalds'}
	}];
var cc = 0;
describe('api test', function(){
	_.each(testData, function(ops){
		describe('api ' + ops.fnName, function(){
			if(ops.active){
				(function(ops){
					var log = bunyan.createLogger({
								  name: ops.fnName,
								  streams: [
								    {
								      level: 'info',
								      path: './logs/'+ops.fnName+'-'+ops.msg+'-info.log'
								    }
								  ]
								});
						var response = false;
						var obj = {};
						//sample data
						var params = ops.params;
						beforeEach(function(done){
							cc++;
							console.log(cc);
							obj = api.load(ops.fnName);
							var typecheck = typeof obj.fire === 'function';
							expect(typecheck).toEqual(true);
							var callback = function(res){
								response  = res;
								var keymap = kmap(response);
								var output = JSON.serialize(keymap);
								console.log("------------------------");
								console.log(ops.fnName);
								console.log(output);
								console.log("------------------------");
								log.info(output);
								done();
							}
							obj.fire(params, callback);
					    });
						it(ops.msg, function(){
							var typecheck = typeof response === 'object';
							expect(typecheck).toBeTruthy();
						});
				})(ops)
			}
		});
	});
});
function kmap(obj){
	var res = _.map(obj, function(item, key){
		var r = {};
		if(typeof item === 'object'){
			r[key] = kmap(item);
		}else{
			r[key] = typeof item;	
		}
		return r;
	});
	return res;
}

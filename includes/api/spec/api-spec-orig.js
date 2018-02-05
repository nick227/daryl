'use strict';

var _ = require('underscore');
var api = require('../api');
var publicIp = require('public-ip');
jasmine.getEnv().defaultTimeoutInterval = 2500;

var testData = [{
	active:true,
	msg:'civicInfo rep search address',
	fnName:'civicRepresentatives',
	params:{address: '1822 S. Congress Ave. Austin TX'}
	},
	{
	active:true,
	msg:'locu venue search should find dans hamburgers',
	fnName:'locuVenue',
	params:{address: '1822 S. Congress Ave. Austin TX'}
	},
	{
	active:false,
	msg:'',
	fnName:'',
	params:
	},
	{
	active:false,
	msg:'',
	fnName:'',
	params:
	},
	{
	active:false,
	msg:'',
	fnName:'',
	params:
	},
	{
	active:false,
	msg:'',
	fnName:'',
	params:
	},
	{
	active:false,
	msg:'foursquare should find zilker park',
	fnName:'foursquareVenue',
	params:{
			ll: '30.269097,-97.7722281',
			query: 'zilker park',
			limit: 5//max 50
			}
	},
	{
	active:false,
	msg:'zillow should find 78701',
	fnName:'zillowSearch',
	params:'78701'
	},
	{
	active:false,
	msg:'fandango should find 78701',
	fnName:'fandango',
	params:'78701'
	},
	{
	active:false,
	msg:'youtube should find downtown austin',
	fnName:'youtubeSearch',
	params:{term:'downtown austin', max:3}
	},
	{
	active:false,
	msg:'flickr should find austin photos',
	fnName:'flickrSearch',
	params:{city:'austin'}
	},
	{
	active:false,
	msg:'indeed search should find dallas indeed.com jobs',
	fnName:'indeedSearch',
	params:{
		radius:500,
		where:{
			city:"Dallas",
			state:"TX"
		},
		limit:2,
		keywords:[],
		sortBy:'date'
	}
	}];

describe('api lop', function(){
	_.each(testData, function(ops){
		if(ops.active){
			(function(ops){
					var response = false;
					var obj = {};
					console.log("k");
					//sample data
					var params = ops.params;
					beforeEach(function(done){
						console.log("jj");
						obj = api.load(ops.fnName);
						var typecheck = typeof obj.fire === 'function';
						expect(typecheck).toEqual(true);
						var callback = function(res){
							response  = res;
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

/****************
# sunlightLegislators

ddescribe("sunlight legislators zip search", function(){
	var response = false;
	var sunlight = {};
	//sample data
	var params = '78729';
	beforeEach(function(done){
		sunlight = api.load('sunlightLegislators');
		var typecheck = typeof sunlight.fire === 'function';
		expect(typecheck).toEqual(true);
		var callback = function(res){
			response  = res;
			done();
		}
		sunlight.fire(params, callback);
    });
	it("should find austin rep info", function(){
		var typecheck = typeof response === 'object';
		expect(typecheck).toBeTruthy();
	});
});
****************/
/****************
# civicInfo
describe("civicInfo rep search", function(){
	var response = false;
	var civicInfo = {};
	//sample data
	var params = {address: '1822 S. Congress Ave. Austin TX'};
	beforeEach(function(done){
		civicInfo = api.load('civicRepresentatives');
		var typecheck = typeof civicInfo.fire === 'function';
		expect(typecheck).toEqual(true);
		var callback = function(res){
			response  = res;
			done();
		}
		civicInfo.fire(params, callback);
    });
	it("should find austin rep info", function(){
		var typecheck = typeof response === 'object';
		expect(typecheck).toBeTruthy();
	});
});

****************/
/****************
# locuVenue
describe("locu venue search", function(){
	var response = false;
	var locu = {};
	//sample data
	var params = {name:'Dan\'s Hamburgers', street_address:'1822 S. Congress Ave.', locality:'austin'};
	beforeEach(function(done){
		locu = api.load('locuVenue');
		var typecheck = typeof locu.fire === 'function';
		expect(typecheck).toEqual(true);
		var callback = function(res){
			response  = res;
			done();
		}
		locu.fire(params, callback);
    });
	it("should find dans hamburgers", function(){
		var typecheck = typeof response === 'object';
		expect(typecheck).toBeTruthy();
	});
});
****************/

/****************
# indeedSearch
describe("indeed search", function(){
	var response = false;
	var indeed = {};
	//sample data
	var params = {
		radius:500,
		where:{
			city:"Dallas",
			state:"TX"
		},
		limit:2,
		keywords:[],
		sortBy:'date'
	};
	beforeEach(function(done){
		publicIp.v4().then(function(ip){
			indeed = api.load('indeedSearch', {ip:ip});
			var typecheck = typeof indeed.fire === 'function';
			expect(typecheck).toEqual(true);
			var callback = function(res){
				response  = res;
				done();
			}
			indeed.fire(params, callback);
		});

    });
	it("should find dallas indeed.com jobs", function(){
		var typecheck = typeof response === 'object';
		expect(typecheck).toBeTruthy();
	});
});
****************/


/****************
# flickrSearch
****************/
describe("flickr search", function(){
	var response = false;
	var flickr = {};
	//sample data
	var params = {city:'austin'};
	beforeEach(function(done){
		flickr = api.load('flickrSearch');
		var typecheck = typeof flickr.fire === 'function';
		expect(typecheck).toEqual(true);
		var callback = function(res){
			response  = res;
			done();
		}
		flickr.fire(params, callback);
    });
	it("should find austin photos", function(){
		var typecheck = typeof response === 'object';
		expect(typecheck).toBeTruthy();
	});
});


/****************
# youtube
****************/
describe("youtube search", function(){
	var response = false;
	var youtube = {};
	//sample data
	var params = {term:'downtown austin', max:3};
	beforeEach(function(done){
		youtube = api.load('youtubeSearch');
		var typecheck = typeof youtube.fire === 'function';
		expect(typecheck).toEqual(true);
		var callback = function(res){
			response  = res;
			done();
		}
		youtube.fire(params, callback);
    });
	it("should find downtown austin", function(){
		var typecheck = typeof response === 'object';
		expect(typecheck).toBeTruthy();
	});
});

/****************
# fandango
****************/
describe("fandango search by zip code", function(){
	var response = false;
	var fandango = {};
	//sample data
	var params = '78701';
	beforeEach(function(done){
		fandango = api.load('fandango');
		var typecheck = typeof fandango.fire === 'function';
		expect(typecheck).toEqual(true);
		var callback = function(res){
			response  = res;
			done();
		}
		fandango.fire(params, callback);
    });
	it("should find 78701", function(){
		var typecheck = typeof response === 'object';
		expect(typecheck).toBeTruthy();
	});
});


/****************
# zillowSearch
****************/
describe("zillow search by zip code", function(){
	var response = false;
	var zillow = {};
	//sample data
	var param = '78701';
	beforeEach(function(done){
		zillow = api.load('zillowSearch');
		var typecheck = typeof zillow.fire === 'function';
		expect(typecheck).toEqual(true);
		var callback = function(res){
			response  = res.response;
			done();
		}
		zillow.fire(param, callback);
    });
	it("should find 78701", function(){
		var typecheck = typeof response === 'object';
		expect(typecheck).toBeTruthy();
	});
});


/****************
# foursquare
****************/
describe("foursquare venues", function(){
	var response = false;
	var foursquare = {};
	//sample data
	var obj = {
			ll = '30.269097,-97.7722281',
			query = 'zilker park',
			limit = 5//max 50
			};
	beforeEach(function(done){
		foursquare = api.load('foursquareVenue');
		var typecheck = typeof foursquare.fire === 'function';
		expect(typecheck).toEqual(true);
		var callback = function(res){
			response  = res;
			done();
		}
		foursquare.fire(obj, callback);
    });
	it("foursquare should find zilker park", function(){
		var typecheck = typeof response === 'object';
		expect(typecheck).toBeTruthy();
	});
});

/****************
# googlePlaces
****************/
describe("google places", function(){
	var response = false;
	var googlePlaces = {};
	//sample data
	var obj = {};
	obj.venue = 'University of Texas';
	obj.city = 'Austin';
	obj.address = '110 Inner Campus Drive Austin, TX 78705';
	beforeEach(function(done){
		googlePlaces = api.load('googlePlaces');
		var typecheck = typeof googlePlaces.fire === 'function';
		expect(typecheck).toEqual(true);
		var callback = function(res){
			response  = res;
			done();
		}
		googlePlaces.fire(obj, callback);
    });
	it("should find UT Austin", function(){
		var typecheck = typeof response === 'object';
		expect(response.status).toBeTruthy();
	});
});
/****************
# googleSearch
****************/
describe("google search", function(){
	var response = false;
	var googleSearch = {};
	//sample data
	var obj = {term:'Bob Schneider'};
	beforeEach(function(done){
		googleSearch = api.load('googleSearch');
		var typecheck = typeof googleSearch.fire === 'function';
		expect(typecheck).toEqual(true);
		var callback = function(res){
			response  = res;
			done();
		}
		googleSearch.fire(obj, callback);
    });
	it("should find Bob Schneider results", function(){
		var typecheck = typeof response === 'object';
		expect(response.items.length).toBeTruthy();
	});
});
/***************
# yelpBusiness
***************/
describe("yelp business search", function(){
	var response = false;
	var yelpBusiness = {};
	//sample data
	var obj = {};
	obj.venue = "Barflys";
	obj.city = 'Austin';
	beforeEach(function(done){
		yelpBusiness = api.load('yelpBusiness');
		var typecheck = typeof yelpBusiness.fire === 'function';
		expect(typecheck).toEqual(true);
		var callback = function(res){
			response  = res;
			done();
		}
		yelpBusiness.fire(obj, callback);
    });
	it("should find Barflys", function(){
		var typecheck = typeof response === 'object';
		expect(response.is_claimed).toBeTruthy();
	});
});
/***************
# instagramLocation
***************/
describe("instagram location search", function(){
	var response = false;
	var instagramLocation = {};
	//sample data
	var obj = {lat:30.269097, lng:-97.7722281};
	beforeEach(function(done){
		instagramLocation = api.load('instagramLocation');
		var typecheck = typeof instagramLocation.fire === 'function';
		expect(typecheck).toEqual(true);
		var callback = function(res){
			response  = res;
			done();
		}
		instagramLocation.fire(obj, callback);
    });
	it("should find zilker", function(){
		var typecheck = typeof response === 'object';
		expect(response.data.length).toBeTruthy();
	});
});
/***************
# instagramTags
****************/
describe("instagram tag search", function(){
	var response = false;
	var instagramTags = {};
	//sample data
	var obj = {term:'austin tx'}
	beforeEach(function(done){
		instagramTags = api.load('instagramTags');
		var typecheck = typeof instagramTags.fire === 'function';
		expect(typecheck).toEqual(true);
		var callback = function(res){
			response  = res;
			done();
		}
		instagramTags.fire(obj, callback);
	});
	it("should find austin tx", function(){
		var typecheck = typeof response === 'object';
		expect(response.data.length).toBeTruthy();
	});
});
/***************
# twitterSearch
****************/
describe("twitter search", function(){
	var response = false;
	var twitterSearch = {};
	//sample data
	var obj = {venue:'McDonalds'}
	beforeEach(function(done){
		twitterSearch = api.load('twitterSearch');
		var typecheck = typeof twitterSearch.fire === 'function';
		expect(typecheck).toEqual(true);
		var callback = function(res){
			response = res;
			done();
		}
		twitterSearch.fire(obj, callback);
	});
	it("should find McDonalds", function(){
		var typecheck = typeof response === 'object';
		expect(response.statuses.length).toBeTruthy();
	});
});
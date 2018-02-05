var express = require('express');
var router = express.Router();
var db = require("../server/db/mongodb.js");
var mongo = new db('localfu', 'Jobs');

router.get('/', function(req, res, next) {
	mongo.find({sort:{_id:-1}}).then(function(data){
		res.render('jobs', { title: 'jobs', data:data });
	});
});

module.exports = router;

"use strict";

var system = (function(){

	function db(dnName, collectionName){
		this.name = name;
		this.update = function(vars){
			console.log("cools");
			console.log(vars);
		}
	}
	return {
		db:db
	};

})();
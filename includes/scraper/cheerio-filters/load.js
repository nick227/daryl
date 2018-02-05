
module.exports = {
	load:function(key){
		var path = './'+key+'.js';
		return require(path);
	}
};
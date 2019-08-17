let request = require('request');
let config = require('./config');

module.exports.getPrice = () =>{
	return new Promise(function(resolve, reject) {
		request(config.PRICE_ENDPOINT, function (error, response, body) {
		  if(error){
		  	console.log(error);
		  }
		  if(response.statusCode == 200){
		  	return resolve(JSON.parse(body));
		  }else{
		  	console.log(`Status code = ${response.statusCode}.  Something went wrong!`);
		  	return resolve(null);
		  }	  
		});
	});
};
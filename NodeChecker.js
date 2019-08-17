let request = require('request');
let config = require('./config');
let emailer = require('./Emailer');

const getOurOfflineNodes = (nodes) => {
	let offlineNodes = nodes.offlineNodes.filter(offlineNode => {
		return config.NODES.indexOf(offlineNode.address) > -1;
	});
	return offlineNodes;
};

const getOurNodes = (nodes) => {
	let onlineNodes = nodes.onlineNodes.filter(onlineNode => {
		return config.NODES.indexOf(onlineNode.address) > -1;
	});
	let offlineNodes = nodes.offlineNodes.filter(offlineNode => {
		return config.NODES.indexOf(offlineNode.address) > -1;
	});

	return onlineNodes.concat(offlineNodes);
};

module.exports.checkNodes = () => {
	request(config.STATUS_ENDPOINT, function (error, response, body) {
		if(error){
			console.log(error);
		}
		if(response.statusCode === 200){
			let offlineNodes = getOurOfflineNodes(JSON.parse(body));
			if(offlineNodes != null && offlineNodes.length > 0){
				emailer.nodeOfflineEmail(offlineNodes);
			}
		}
	});
};

module.exports.checkBalances = () => {
	request(config.BALANCE_ENDPOINT, function (error, response, body) {
		if(error){
			console.log(error);
		}
		if(response.statusCode === 200){
			let ourNodes = getOurNodes(JSON.parse(body));
			if(ourNodes != null && ourNodes.length > 0){
				let cryptoPrices = require('./CryptoPrices');
				cryptoPrices.getPrice().then(function(priceObj){
					let price = 0;
					if(priceObj != null){
						price = parseFloat(priceObj.price);
					}
					emailer.nodeBalancesEmail(ourNodes, price);
				});
			}
		}
	});
};
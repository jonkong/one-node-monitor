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

const getBalanceByAddress = async(address) => {
	return new Promise(function(resolve, reject) {
		let url = config.BALANCE_ENDPOINT + address;
		request(url, function (error, response, body) {
			if(error){
				console.log(error);
				return resolve({"address" : address, "balance" : 0});
			}
			if(response.statusCode === 200){
				let nodeObj = JSON.parse(body);
				return resolve({"address" : address, "balance" : nodeObj.address.balance / 10e17});
			}else{
				return resolve({"address" : address, "balance" : 0});
			}
		});
	});
};

module.exports.checkBalances = () => {
	Promise.all(config['NODES'].map(getBalanceByAddress)).then((ourNodes) => {
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
	});
	
	/*
	request(url, function (error, response, body) {
		if(error){
			console.log(error);
		}
		if(response.statusCode === 200){
			let nodeObj = JSON.parse(body);

			console.log(nodeObj.address.balance / 10e17);
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
	});*/
};
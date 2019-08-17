let nodeChecker = require('./NodeChecker');

// Define a request router
let handlers = {
	'check-nodes' : { 
		"func" : nodeChecker.checkNodes
	},
	'check-balances' : {
		"func" : nodeChecker.checkBalances
	}
};

const main = async () => {
	const processName = process.argv[2];
	const handler = handlers[processName];
	handler.func();
};

main();
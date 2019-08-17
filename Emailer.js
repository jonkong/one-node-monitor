let nodemailer = require('nodemailer');
let config = require('./config');
let moment = require('moment-timezone');

let transporter = nodemailer.createTransport({
  service: config.EMAIL.SERVICE,
  auth: {
    user: config.EMAIL.USER,
    pass: config.EMAIL.PASS
  }
});

module.exports.nodeOfflineEmail = (offLineNodes) => {
	let mailText = [];
	offLineNodes.forEach(function(offLineNode){
		mailText.push(`address: ${offLineNode.address}, shard : ${offLineNode.shard}, ONEsPerHour : ${offLineNode.ONEsPerHour}`);
	});
	var mailOptions = {
	  from: config.EMAIL.FROM,
	  to: config.EMAIL.TO,
	  subject: 'ONE nodes are offline!',
	  text: mailText.join("\n\r")
	};
	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    console.log(error);
	  } else {
	    console.log('Email sent: ' + info.response);
	  }
	});
};

module.exports.nodeBalancesEmail = (ourNodes, price) => {
	var chicagoTime = moment.tz(new Date(), "America/Chicago").format("YYYY-MM-DD h:m:s");
	let mailText = [];
	let totalBalance = 0;
	ourNodes.forEach(function(ourNode){
		totalBalance += parseFloat(ourNode.totalBalance);
		mailText.push(`address: ${ourNode.address}, shard : ${ourNode.shard}, totalBalance : ${ourNode.totalBalance}`);
	});
	let usdtBalance = Math.round(price * totalBalance * 100) / 100;
	mailText.push(`Our TotalBalance : ${totalBalance}`);
	mailText.push(`Total Balance at ${price}/ONEUSDT: $${usdtBalance}`);
	var mailOptions = {
	  from: config.EMAIL.FROM,
	  to: config.EMAIL.TO,
	  subject: `ONE Nodes Balances at ${chicagoTime}`,
	  text: mailText.join("\n\r")
	};
	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    console.log(error);
	  } else {
	    console.log('Email sent: ' + info.response);
	  }
	});
};
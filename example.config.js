/*
 *  Create and export configuration variables
 *
 */

module.exports = {
	"EMAIL" : { 
		"SERVICE" : "gmail",
		"FROM" : "user@gmail.com", 
		"TO" : "johndoe@gmail.com,janedoe@gmail.com", 
		"USER" : 'user@gmail.com',
		"PASS" : 'password'
	},
	"STATUS_ENDPOINT" : "https://harmony.one/1h.json",
	"BALANCE_ENDPOINT" : "https://harmony.one/balances.json",
	"PRICE_ENDPOINT" : "https://api.binance.com/api/v3/ticker/price?symbol=ONEUSDT",
	"NODES" : ["one19999999999999999999999999", "one188888888888888888888888888888"]
};
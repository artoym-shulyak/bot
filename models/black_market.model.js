const mongoose = require('mongoose');
const Schema = mongoose.Schema

const blackMarketSchema = new Schema({
	uuid: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	price: {
		type: Number,
	 default: 15
	},
	donat: {
		type: Number,
	 default: 450
	},
	count: {
		type: Number,
	 default: 1
	}

}, {
	versionKey: false
})

const BlackMarket = mongoose.model('black_market', blackMarketSchema)

module.exports = BlackMarket



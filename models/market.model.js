const mongoose = require('mongoose');
const Schema = mongoose.Schema

const marketSchema = new Schema({
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
	 default: 1
	},
	player: {
		type: Object,
		default: {
			uuid: null,
			name: 'null'
		}
	}
}, {
	versionKey: false
})

const Market = mongoose.model('market', marketSchema)

module.exports = Market



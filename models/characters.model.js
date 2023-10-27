const mongoose = require('mongoose');
const Schema = mongoose.Schema

const ChractersSchema = new Schema({
	uuid: {
		type: Number,
		default: 1
	},
	name: {
		type: String,
		default: 'Саске Учиха'
	},
	stats: {
		type: Object,
		default: {
			bm: 120,
			hp: 450
		}
	},
	rank: {
		type: String,
	 default: 'F'
	},
	image: {
		type: String,
	 default: './images/SasukeUchiha_A.png'
	},
	description: {
		type: String,
	 default: 'Цитатааа' 
	},
	search: {
		type: String,
	default: 'саске учиха'
	},
	hashtag: {
		type: String,
	 default: 'saskeuchiha_f'
	},
	dropChance: {
		type: Number,
	 default: 0
	}
}, {
	versionKey: false
})

const Characters = mongoose.model('characters', ChractersSchema)

module.exports = Characters



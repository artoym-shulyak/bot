const mongoose = require('mongoose');
const Schema = mongoose.Schema

const rating = new Schema({
	uuid: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	combatPower: {
		type: Number,
		default: 120
	},
	battle: {
		type: Number,
	 default: 1
	},
	combatPower: {
		type: Number,
	 default: 1
	},
	battleCharacter: {
		type: Number,
	 default: 1
	},
	teamCharacters: {
		type: Number,
	 default: 1
	},
	countCharacters: {
		type: Number,
	 default: 1
	},
	recruteChar: {
		type: Number,
	 default: 1
	}
}, {
	versionKey: false
})

const Rating = mongoose.model('rating', rating)

module.exports = Rating



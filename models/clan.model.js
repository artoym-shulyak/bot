const mongoose = require('mongoose');
const Schema = mongoose.Schema

const clanSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	image: {
		type: String,
	 default: ''
	},
	leader: {
		type: Object,
		uuid: null,
		username: null,
		required: true
	},
	chat: {
		type: String,
	 default: 'https://t.me/AnimeBattleGame_bot'
	},
	description: {
		type: String,
	 default: 'Описание Гильдии'
	},
	employees: {
		type: [],
	 default: []
	},
	stats: {
		type: Object,
		stats: {
			bm: 0,
			hp: 0,
		}
	},
	glory: {
		type: Number,
	 default:0
	},
	money: {
		type: Number,
	 default: 0
	},
	structure: {
		type: Number,
	 default: 30
	},
	benchEmployees: {
		type: [],
	 default: []
	},
	quest: {
		type: Object,
		default: {
			count: 10, // Для выполенения задачи нужно...
			todayCompleted: 0, // Сегодняшний прогресс приглашенных рефералов
			reward: 1, // Награда
			completed: false, // Выполнено?
			stateReward: false, // Сможет забрать награду?
		}
	},
	updated: { 
		type: Date, 
	 default: Date.now
	}
}, {
	versionKey: false
})

const Clan = mongoose.model('clans', clanSchema)

module.exports = Clan



const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
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
	stateRecrute: {
		type: Number,
	 default: 0
	},
	stats: {
		type: Object,
	 default: {
	 	bm: 120,	 	
	 	hp: 450
	 }
	},
	characters: {
		type: [],
	 default: [ 0 ]
	},
	glory: {
		type: Number,
	 default: 0
	},
	resources: {
		type: Object,
	 default: {
	 	amulets: {
	 		first: false,
	 		second: false,
	 		third: false
	 	},
	 	books: {
	 		first: false,
	 		second: false,
	 		third: false
	 	},
	 	crio: 0,
	 	recrute: 15,
	 	gems: 0
	 }
	},
	vipCard: {
	type: Object,
	default: {
		vip: 1,
		vip1: true,
		vip2: false,
		vip3: false,
		vip4: false,
		vip5: false,
	}
},
	referral: {
		type: Object,
		default: {
			count: 2, // Для выполенения задачи нужно...
			todayCompleted: 0, // Сегодняшний прогресс приглашенных рефералов
			reward: 5, // Награда
			completed: false, // Выполнено?
			stateReward: false, // Сможет забрать награду?
			countReferrals: 0, // Всего приглашенных рефераловб
			referrer: false
		}
	},
	quest: {
		type: Object,
		default: {
			first: {
				countCompleted: 0, // Прогресс игрока
				count: 2, // Для выполенения задачи нужно...
				reward: 1, // Награда
				completed: false, // Выполнено?
				stateReward: false // Сможет забрать награду?
			},
			second: {
				countCompleted: 0,
				count: 2,
				reward: 1,
				completed: false,
				stateReward: false,
			},
			third: {
				countCompleted: 0,
				count: 2,
				reward: 1,
				completed: false,
				stateReward: false,
			},
			fourth: {
				countCompleted: 0,
				count: 2,
				reward: 1,
				completed: false,
				stateReward: false,
			},
			fifth: {
				countCompleted: 0,
				count: 2,
				reward: 1,
				completed: false,
				stateReward: false,
			},
		}
	},
	pagesMyCharacters: {
		type: Object,
		default: {
			page: 0,
			offset: 0
		}
	},
	battle: {
		type: Object,
	 default: {
	 	char: {
				uuid: 0,
				name: 'Саске Учиха',
				stats: {
					bm: 120,
					hp: 450,
				},
				rank: 'F',
				image: './images/SasukeUchiha_A.png',
				description:'Мои глаза давно закрыты, ведь цель моя лежит во тьме...',
				search: 'саске учиха',
				hashtag: 'saskeuchiha_f',
	 	},
	 	teamCharacters: {
		 	first:{
					uuid: 0,
					name: 'Луффи',
					stats: {
						bm: 120,
						hp: 450,
					},
					rank: 'F',
					image: './images/SasukeUchiha_A.png',
					description:'Мои глаза давно закрыты, ведь цель моя лежит во тьме...',
					search: 'саске учиха',
					hashtag: 'saskeuchiha_f',
		 	},
		 	second:{
					uuid: 0,
					name: 'Нацу Драгнил',
					stats: {
						bm: 120,
						hp: 450,
					},
					rank: 'F',
					image: './images/SasukeUchiha_A.png',
					description:'Мои глаза давно закрыты, ведь цель моя лежит во тьме...',
					search: 'саске учиха',
					hashtag: 'saskeuchiha_f',
		 	},
		 	third:{
					uuid: 0,
					name: 'Наруто Узумаки',
					stats: {
						bm: 120,
						hp: 450,
					},
					rank: 'F',
					image: './images/SasukeUchiha_A.png',
					description:'Мои глаза давно закрыты, ведь цель моя лежит во тьме...',
					search: 'саске учиха',
					hashtag: 'saskeuchiha_f',
		 	}
	 	},
	 }
	},
	deadlines: {
		type: Object,
		default: {
			battle: {
				deadline: {
					type: Date,
				 default: Date.now 
				},
				term: 0
			},
			battleChar: {
				deadline: {
					type: Date,
				 default: Date.now 
				},
				term: 0
			},
			battleTeamCharacters: {
				deadline: {
					type: Date,
				 default: Date.now 
				},
				term: 0
			},
			bonus: {
				deadline: {
					type: Date,
				 default: Date.now 
				},
				term: 8
			},
			bookFirst: {
				type: Date,
				deadline: 0,
				state: false
			},
			bookSecond: {
				type: Date,
				deadline: 0,
				state: false
			},
			bookThird: {
				type: Date,
				deadline: 0,
				state: false
			},
		}
	},
	settings: {
		type: Object,
		default: {
			visibility: {
		 	vipCard: false,
		 	crio: false,
		 	card: false,
			},
			countName: 0
		}
	},
	clan: {
		type: Object,
	default: {
		clan: false,
		leader: false,
		assistant: false,
		name: 'null'
	}
	},
	placeEvents: {
		type: Object,
		default: {
			recruteChar: 0
		}
	},
	updated: { 
		type: Date, 
	 default: Date.now
	}
}, {
	versionKey: false
})

const User = mongoose.model('users', userSchema)

module.exports = User


// {
// 	"uuid": "6540263900",
// 	"name": "Artoym",
// 	"countName": 0,
	// "visibility": {
	// 	"characters": false,
	// 	"vipCard": true,
	// 	"crio": false,
	// 	"card": false,
	// 	"all": false
	// },
// 	"stats": {
// 		"bm": 1300,
// 		"hp": 12345
// 	},
// 	"characters": [ 0 ],
// 	"resources": {
// 		"amulets": {
// 			"first": false,
// 			"second": true,
// 			"third": false
// 	 },
//  	"books": {
//  		"first": false,
//  		"second": false,
//  		"third": false
//  	},
// 	 "vipCard": {
// 	 	"vip": 0,
// 	 	"vip_1": false,
// 	 	"vip_2": false,
// 	 	"vip_3": false,
// 	 	"vip_4": false,
// 	 	"vip_5": false,
// 	 },
// 	 "crio": 56023,
// 	 "recrute": 2,
// 	 "gems": 25,
//  },
//  "bonus": {
//  	"timer": {
//  		"total": 0,
//  		"days:": 0,
//  		"hours": 0,
//  		"minutes": 0,
//  		"seconds": 0
//  	},
//  	"deadline": ''
//  },
// 	"referral": { 
// 			"count": 2, 
// 			"countReferrals": 0, 
// 			"todayCompleted": 0, 
// 			"reward": 5, 
// 			"completed": false, 
// 			"stateReward": false 
// 	},
// 	"dailyQuest": {
// 	 "ready": 0, 
// 		"first": {
// 			"countCompleted": 0,
// 			"count": 2,
// 			"reward": 5,
// 			"completed": false,
// 			"stateReward": false,
// 		},
// 		"second": {
// 			"countCompleted": 0,
// 			"count": 4,
// 			"reward": 10,
// 			"completed": false,
// 			"stateReward": false,
// 		}
// 	},
// 	"events": {
// 		"characters": {
// 			 "count": 18,
// 			 "place": 0
// 		}
// 	},
// 	"listCharacters": {
// 			"page": 0,
// 			"offset": 0
// 	},
// 	"battle": {
// 		"character": {
// 				"uuid": 0,
// 				"name": 'Саске Учиха',
// 				"stats": {
// 					"bm": 120,
// 					"hp": 450,
// 				},
// 				"rank": 'F',
// 				"image": './images/SasukeUchiha_A.png',
// 				"description":'Мои глаза давно закрыты, ведь цель моя лежит во тьме...',
// 				"search": 'саске учиха',
// 				"hashtag": 'saskeuchiha_f',
// 		},
// 	},
// 	"place": {
// 		"battleCharacter": 0,
//    "battle": 0
// 	}
// }



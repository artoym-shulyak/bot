const { Composer, Markup, Extra } = require('telegraf')
const bot = new Composer()
const User = require('../../models/user.model.js')
const throttle = require('../../utils/throttle.js')

// Задание №
const questTask = async (ctx) => {
	try {
		const uuid = ctx[0].from.id // ID user
		const data = ctx[0].match[0] // Information btn
		if (data.indexOf(uuid) === -1) return // Проверка чужокого нажатия на кнопку 
		let reward
		let completed

	 await User.findOne({uuid})
	 .then(async user => {
			switch (ctx[2]) {
			  case 1:
			  	 reward = user.quest.first.stateReward
			  	 completed = user.quest.first.completed
			    break;
			  case 2:
			  	 reward = user.quest.second.stateReward
			  	 completed = user.quest.second.completed
			    break;
			  case 3:
			  	 reward = user.quest.third.stateReward
			  	 completed = user.quest.third.completed
			    break;
			  case 4:
			  	 reward = user.quest.fourth.stateReward
			  	 completed = user.quest.fourth.completed
			    break;
			  case 5:
			  	 reward = user.quest.fifth.stateReward
			  	 completed = user.quest.fifth.completed
			    break;
			  default:
			    console.log('Error with tasks.js on task 1')
			}

	 	if (reward) {
				await ctx[0].editMessageText(ctx[0].i18n.t(`quest_${ctx[1]}`, 
					{
						countCompleted: await user.quest[ctx[1]].countCompleted, // Прогресс задачи
						completed: '✅', // Состояние задачи
						stateReward: '✅', // Состояние, забрал ли игрок свою награду,
						reward: await user.quest[ctx[1]].reward,
						count: await user.quest[ctx[1]].count
					}
					), 
				Extra.markup(Markup.inlineKeyboard([Markup.callbackButton('⬅️ Назад', `quest_${uuid}`)])).HTML()
				)
			 ctx[0].answerCbQuery(`📜 Задание ${ctx[2]}`, {cache_time: 3})
				return
	 	}

	 	if (completed) {
				await ctx[0].editMessageText(ctx[0].i18n.t(`quest_${ctx[1]}`, 
					{
						countCompleted: await user.quest[ctx[1]].countCompleted, // Прогресс задачи
						completed: await user.quest[ctx[1]].completed ? '✅' : '❌', // Состояние задачи
						stateReward: await user.quest[ctx[1]].stateReward ? '✅' : '❌', // Состояние, забрал ли игрок свою награду,
						reward: await user.quest[ctx[1]].reward,
						count: await user.quest[ctx[1]].count
					}
					), 
				Extra.markup(Markup.inlineKeyboard([
					Markup.callbackButton('⬅️ Назад', `quest_${uuid}`),
					Markup.callbackButton('🎁 Забрать', `q_award_${ctx[2]}_${uuid}`)
					])).HTML()
				)	
			 ctx[0].answerCbQuery(`📜 Задание ${ctx[2]}`, {cache_time: 3})
	 	} else {
				await ctx[0].editMessageText(ctx[0].i18n.t(`quest_${ctx[1]}`, 
					{
						countCompleted: await user.quest[ctx[1]].countCompleted, // Прогресс задачи
						completed: await user.quest[ctx[1]].completed ? '✅' : '❌', // Состояние задачи
						stateReward: await user.quest[ctx[1]].stateReward ? '✅' : '❌', // Состояние, забрал ли игрок свою награду,
						reward: await user.quest[ctx[1]].reward,
						count: await user.quest[ctx[1]].count
					}
					), 
				Extra.markup(Markup.inlineKeyboard([
					Markup.callbackButton('⬅️ Назад', `quest_${uuid}`)
					])).HTML()
				)		
			 ctx[0].answerCbQuery(`📜 Задание ${ctx[2]}`, {cache_time: 3})
	 	}
	 })
	} catch (e) {
		console.error(e)
	}
}

// Забрать награду
const getAwardTaskQuest = async (ctx) => {
	try {
		const uuid = ctx[0].from.id // ID user
		const data = ctx[0].match[0] // Information btn
		if (data.indexOf(uuid) === -1) return // Проверка чужокого нажатия на кнопку

		ctx[0].deleteMessage()

		if (ctx[1] === '1') {
			await User.findOne({uuid})
			.then(async user => {
				if (user.quest.first.stateReward) return
				if (user.quest.first.completed === true) {
					await User.updateOne({uuid}, { $set: { "quest.first.stateReward": true }, $inc: { "resources.crio": user.quest.first.reward} })
					await ctx[0].reply(`🎁 Успешно забрал награду за 📜 Задание 1. `)
					ctx[0].answerCbQuery(`🎁 Успешно`, {cache_time: 3})
				}
			})	
			return
		}

		if (ctx[1] === '2') {
			await User.findOne({uuid})
			.then(async user => {
				if (user.quest.second.stateReward) return
				if (user.quest.second.completed === true) {
					await User.updateOne({uuid}, { $set: { "quest.second.stateReward": true }, $inc: { "resources.crio": user.quest.second.reward} })
					await ctx[0].reply(`🎁 Успешно забрал награду за 📜 Задание 2. `)
					ctx[0].answerCbQuery(`🎁 Успешно`, {cache_time: 3})
				}
			})
			return
		}

		if (ctx[1] === '3') {
			await User.findOne({uuid})
			.then(async user => {
				if (user.quest.third.stateReward) return
				if (user.quest.third.completed === true) {
					await User.updateOne({uuid}, { $set: { "quest.third.stateReward": true }, $inc: { "resources.crio": user.quest.third.reward} })
					await ctx[0].reply(`🎁 Успешно забрал награду за 📜 Задание 3. `)
					ctx[0].answerCbQuery(`🎁 Успешно`, {cache_time: 3})
				}
			})
			return
		}

		if (ctx[1] === '4') {
			await User.findOne({uuid})
			.then(async user => {
				if (user.quest.fourth.stateReward) return
				if (user.quest.fourth.completed === true) {
					await User.updateOne({uuid}, { $set: { "quest.fourth.stateReward": true }, $inc: { "resources.crio": user.quest.fourth.reward} })
					await ctx[0].reply(`🎁 Успешно забрал награду за 📜 Задание 4. `)
					ctx[0].answerCbQuery(`🎁 Успешно`, {cache_time: 3})
				}
			})
			return
		}

		if (ctx[1] === '5') {
			await User.findOne({uuid})
			.then(async user => {
				if (user.quest.fifth.stateReward) return
				if (user.quest.fifth.completed === true) {
					await User.updateOne({uuid}, { $set: { "quest.fifth.stateReward": true }, $inc: { "resources.crio": user.quest.fifth.reward} })
					await ctx[0].reply(`🎁 Успешно забрал награду за 📜 Задание 5. `)
					ctx[0].answerCbQuery(`🎁 Успешно`, {cache_time: 3})
				}
			})
			return
		}
	} catch (e) {
		console.error(e)
	}
}

// Троттлинг ----->
let questTaskPlayer = throttle(questTask, 1500)
let getAwardTaskQuestPlayer = throttle(getAwardTaskQuest, 1500)

// Actions
// '📜 Задание 1'
bot.action(new RegExp('q_1_(.+)'), ctx => 	questTaskPlayer([ctx, 'first', 1]))

// '📜 Задание 2'
bot.action(new RegExp('q_2_(.+)'), ctx => 	questTaskPlayer([ctx, 'second', 2]))

// '📜 Задание 3'
bot.action(new RegExp('q_3_(.+)'), ctx => 	questTaskPlayer([ctx, 'third', 3]))

// '📜 Задание 4'
bot.action(new RegExp('q_4_(.+)'), ctx => 	questTaskPlayer([ctx, 'fourth', 4]))

// '📜 Задание 5'
bot.action(new RegExp('q_5_(.+)'), ctx => 	questTaskPlayer([ctx, 'fifth', 5]))

// '🎁 Забрать награду'
bot.action(new RegExp('q_award_1(.+)'), ctx => getAwardTaskQuestPlayer([ctx, '1']))
bot.action(new RegExp('q_award_2(.+)'), ctx => getAwardTaskQuestPlayer([ctx, '2']))
bot.action(new RegExp('q_award_3(.+)'), ctx => getAwardTaskQuestPlayer([ctx, '3']))
bot.action(new RegExp('q_award_4(.+)'), ctx => getAwardTaskQuestPlayer([ctx, '4']))
bot.action(new RegExp('q_award_5(.+)'), ctx => getAwardTaskQuestPlayer([ctx, '5']))

module.exports = bot
const { Composer, Markup, Extra } = require('telegraf')
const bot = new Composer()
const User = require('../../models/user.model.js')
const throttle = require('../../utils/throttle.js')

// -> Other functions from files
bot.use(require('./tasks.js')) // Вип-карты

// 'Ежедневно'
const quests = async (ctx) => {
	try {
		const uuid = String(ctx.from.id) // ID user
		const data = ctx.match[0] // Information btn
		if (data.indexOf(uuid) === -1) return // Проверка чужокого нажатия на кнопку

		await User.findOne({uuid})
  .then(async user => {
  	if (user.quest.first.countCompleted === user.quest.first.count || user.quest.first.countCompleted >= user.quest.first.count) {
		  await User.updateOne({uuid}, { 
		  	$set: { "quest.first.completed": true, "quest.first.countCompleted": user.quest.first.count } 
		  })
	  } 	
  	if (user.quest.second.countCompleted === user.quest.second.count || user.quest.second.countCompleted >= user.quest.second.count) {
		  await User.updateOne({uuid}, { 
		  	$set: { "quest.second.completed": true, "quest.second.countCompleted": user.quest.second.count } 
		  })
	  } 	
  	if (user.quest.third.countCompleted === user.quest.third.count || user.quest.third.countCompleted >= user.quest.third.count) {
		  await User.updateOne({uuid}, { 
		  	$set: { "quest.third.completed": true, "quest.third.countCompleted": user.quest.third.count } 
		  })
	  } 
  	if (user.quest.fourth.countCompleted === user.quest.fourth.count || user.quest.fourth.countCompleted >= user.quest.fourth.count) {
		  await User.updateOne({uuid}, { 
		  	$set: { "quest.fourth.completed": true, "quest.fourth.countCompleted": user.quest.fourth.count } 
		  })
	  } 
  	if (user.quest.fifth.countCompleted === user.quest.fifth.count || user.quest.fifth.countCompleted >= user.quest.fifth.count) {
		  await User.updateOne({uuid}, { 
		  	$set: { "quest.fifth.completed": true, "quest.fifth.countCompleted": user.quest.fifth.count } 
		  })
	  } 
  })
 
  await ctx.editMessageText(ctx.i18n.t('quest'), 
		Extra.markup(
				Markup.inlineKeyboard([
					[Markup.callbackButton('📜 1 ➞ 🃏 Нанять персонажей', `q_1_${uuid}`)],
					[Markup.callbackButton('📜 2 ➞ 🎯 Баттл', `q_2_${uuid}`)],
					[Markup.callbackButton('📜 3 ➞ 🧩 Баттл', `q_3_${uuid}`)],
					[Markup.callbackButton('📜 4 ➞ 🧩 PVP Команда', `q_4_${uuid}`)],
					[Markup.callbackButton('📜 5 ➞ ♻️ Обмен', `q_5_${uuid}`)],
					[Markup.callbackButton('⬅️ Назад', `studia_${uuid}`)]
				])
			).HTML()
  )

  ctx.answerCbQuery('📜 Ежедневно', {cache_time: 3})

	} catch (e) { 
		console.error(e)
	}
}

// Троттлинг ----->
let throttleQuests = throttle(quests, 1500)

// Action
bot.action(new RegExp('quest_(.+)'), ctx => throttleQuests(ctx))

module.exports = bot

const { Composer, Markup, Extra } = require('telegraf')
const bot = new Composer()
const User = require('../../models/user.model.js')
const throttle = require('../../utils/throttle.js')

// Рюкзак
const backpack = async (ctx) => {
 try {
		const uuid = String(ctx.from.id) // ID user
		const data = ctx.match[0] // Information btn
		if (data.indexOf(uuid) === -1) return // Проверка чужокого нажатия на кнопку

		await User.findOne({uuid})
		.then(async user => {
				if (user == null) return
				ctx.editMessageText(ctx.i18n.t('backpack', { 
					crio: await user.resources.crio, 
					gems: await user.resources.gems, 
					recrute: await user.resources.recrute, 
					amuletFirst: await user.resources.amulets.first ? '✅' : '-',
					amuletSecond: await user.resources.amulets.second ? '✅' : '-',
					amuletThird: await user.resources.amulets.third ? '✅' : '-',
					bookFirst: await user.resources.books.first ? '✅' : '-',
					bookFirstTerm: user.deadlines.bookFirst.deadline === 0 ? '-' : await user.deadlines.bookFirst.deadline.toLocaleString("ru-RU").split(',')[0].trim(),
					bookSecond: await user.resources.books.second ? '✅' : '-',
					bookSecondTerm: user.deadlines.bookSecond.deadline === 0 ? '-' : await user.deadlines.bookSecond.deadline.toLocaleString("ru-RU").split(',')[0].trim(),
					bookThird: await user.resources.books.third ? '✅' : '-',
					bookThirdTerm: user.deadlines.bookThird.deadline === 0 ? '-' : await user.deadlines.bookThird.deadline.toLocaleString("ru-RU").split(',')[0].trim(),
				}), 
				Extra.markup(
						Markup.inlineKeyboard([Markup.callbackButton('⬅️ Назад', `studia_${uuid}`)])
					).HTML()
				)
		})

		ctx.answerCbQuery('🎒 Рюкзак', {cache_time: 3})
 } catch (e) {
 	console.error(e)
 }
}

// Троттлинг ----->
let throttleBackpack = throttle(backpack, 1500)

// Actions
bot.action(new RegExp('backpack_(.+)'), ctx => throttleBackpack(ctx))

module.exports = bot

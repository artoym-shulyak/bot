const { Composer, Markup, Extra } = require('telegraf')
const bot = new Composer()
const throttle = require('../../utils/throttle.js')

// Карты
const cards = async (ctx) => {
	try {
		const uuid = String(ctx.from.id) // ID user
		const data = ctx.match[0] // Information btn
		if (data.indexOf(uuid) === -1) return // Проверка чужокого нажатия на кнопку

		await ctx.editMessageText(
			ctx.i18n.t('cards'),
			Extra.markup(
				Markup.inlineKeyboard([
					[Markup.callbackButton('💰 Пополнить', `c_donat_${uuid}`)],
					[Markup.callbackButton('⬅️ Назад', `shop_${uuid}`)],
				])
			).HTML()
		)

		ctx.answerCbQuery('🃏 Карты', { cache_time: 3 })
	} catch (e) {
		console.error(e)
	}
}

let throttleCards = throttle(cards, 1500)

bot.action(new RegExp('cards_(.+)'), ctx => throttleCards(ctx))

module.exports = bot

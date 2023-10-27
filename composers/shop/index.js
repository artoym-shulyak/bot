const { Composer, Markup, Extra } = require('telegraf')
const bot = new Composer()
const throttle = require('../../utils/throttle.js')
const User = require('../../models/user.model.js')

// ⛩ Таверна
const shop = async (ctx) => {
	try {
		const uuid = ctx.from.id
		let action = 'reply'

		if (ctx.updateType === 'callback_query') {
			const data = ctx.match[1]
			if (data.indexOf(uuid) === -1) return
			action = "editMessageText"
		  ctx.answerCbQuery('⛩ Таверна', { cache_time: 3 })
		} 

		if (await User.findOne({uuid}) == null) return

		await ctx[action](
			ctx.i18n.t('⛩ Таверна'),
			Extra.markup(
				Markup.inlineKeyboard([
					[
						Markup.callbackButton('🔮 Амулеты', `amulets_${uuid}`),
						Markup.callbackButton('🃏 Карты', `cards_${uuid}`),
					],
					[
						Markup.callbackButton('📚 Библиотека', `books_${uuid}`),
						Markup.callbackButton('♻️ Обмен', `swap_card_${uuid}`),
					],
					[
						Markup.callbackButton('🏰 Лавка', `clShop_${uuid}`),
						Markup.callbackButton('🪙 Монеты', `clMoney_${uuid}`)
					],
					[
						Markup.callbackButton(
							'🏦 Черный рынок',
							`black_marketplace_${uuid}`
						),
						Markup.callbackButton('〽️ Биржа', `market_${uuid}`),
					],
					[Markup.callbackButton('⬅️ Назад', `world_${uuid}`)],
				])
			).HTML()
		)
	} catch (e) {
		console.error(e)
	}
}

// Троттлинг
let throttleShop = throttle(shop, 1500)

// Messages
bot.hears([new RegExp('таверна', 'i'), '⛩ Таверна'], ctx => throttleShop(ctx))

// Actions
bot.action(new RegExp('shop_(.+)'), ctx => throttleShop(ctx))

module.exports = bot

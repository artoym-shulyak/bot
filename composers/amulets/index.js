const { Composer, Markup, Extra } = require('telegraf')
const bot = new Composer()
const throttle = require('../../utils/throttle.js')

// Амулеты
const amulets = async (ctx) => {
	try {
		const uuid = await String(ctx[0].from.id) // ID user
		const data = await ctx[0].match[0] // Information btn
		if (data.indexOf(uuid) === -1) return // Проверка чужокого нажатия на кнопку

		switch (ctx[1]) {
		 case 'главная':
				await ctx[0].editMessageText(ctx[0].i18n.t('amulets'), 
					Extra.markup(
							Markup.inlineKeyboard([
								[Markup.callbackButton('🪬 Сучонок', `amulet_first_${uuid}`)],
								[Markup.callbackButton('🎖 Дизантэра', `amulet_second_${uuid}`)],
								[Markup.callbackButton('🎭 Демонёнок', `amulet_third_${uuid}`)],
								[Markup.callbackButton('⬅️ Назад', `shop_${uuid}`)],
							])
						).HTML(),
				)
			 ctx[0].answerCbQuery('🔮 Амулеты', {cache_time: 3})
		 	break
		 case 1:
				await ctx[0].editMessageText(
					ctx[0].i18n.t('amulet_first'),
					Extra.markup(
						Markup.inlineKeyboard([
							[Markup.callbackButton('💰 Пополнить 195 ₽', `a_donat_${uuid}`)],
							[Markup.callbackButton('⬅️ Назад', `amulets_${uuid}`)],
						])
					).HTML()
				)
				ctx[0].answerCbQuery('🪬 Сученок', { cache_time: 3 })
		 	break
		 case 2:
				await ctx[0].editMessageText(
						ctx[0].i18n.t('amulet_second'),
						Extra.markup(
							Markup.inlineKeyboard([
								[Markup.callbackButton('💰 Пополнить 890 ₽', `a_donat_${uuid}`)],
								[Markup.callbackButton('⬅️ Назад', `amulets_${uuid}`)],
							])
						).HTML()
					)
				ctx[0].answerCbQuery('🎖 Дизантэра', { cache_time: 3 })
		 	break
		 case 3:
				await ctx[0].editMessageText(
					ctx[0].i18n.t('amulet_third'),
					Extra.markup(
						Markup.inlineKeyboard([
							[Markup.callbackButton('💰 Пополнить 1250 ₽', `a_donat_${uuid}`)],
							[Markup.callbackButton('⬅️ Назад', `amulets_${uuid}`)],
						])
					).HTML()
				)
				ctx[0].answerCbQuery('🎭 Демонёнок', { cache_time: 3 })
		 	break	 	
		 default:
		 	console.log("This component or type amulet doesn't not exist.")
		}

	} catch (e) {
		console.error(e)
	}
}

// Троттлинг
let throttleAmulet = throttle(amulets, 1500)

// Actions
bot.action(new RegExp('amulets_(.+)'), ctx => throttleAmulet([ctx, 'главная']))
bot.action(new RegExp('amulet_first_(.+)'), ctx => throttleAmulet([ctx, 1]))
bot.action(new RegExp('amulet_second_(.+)'), ctx => throttleAmulet([ctx, 2]))
bot.action(new RegExp('amulet_third_(.+)'), ctx => throttleAmulet([ctx, 3]))

module.exports = bot

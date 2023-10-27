const { Composer, Markup, Extra } = require('telegraf')
const bot = new Composer()
const throttle = require('../../utils/throttle.js')

// -> Other functions from files
bot.use(require('./swapping.js')) // Функционал обмен все присутствующих ресурсов

// Виды обменов
const swapComponents = async (ctx) => {
	try {
		const uuid = String(ctx[0].from.id) // ID user
		const data = ctx[0].match[0] // Information btn
		if (data.indexOf(uuid) === -1) return // Проверка чужокого нажатия на кнопку

		switch (ctx[1]) {
		 case 'карты':
				await ctx[0].editMessageText(
					ctx[0].i18n.t('swap_cards'),
					Extra.markup(
						Markup.inlineKeyboard([
							[Markup.callbackButton(' 95 🧊 крио ⇨  5 🃏', `s_c_first_${uuid}`)],
							[
								Markup.callbackButton(
									' 135 🧊 крио ⇨  10 🃏',
									`s_c_second_${uuid}`
								),
							],
							[Markup.callbackButton(' 245 🧊 крио ⇨  30 🃏', `s_c_third_${uuid}`)],
							[
								Markup.callbackButton('🧊 ➠ 🔮', `swap_amulet_${uuid}`),
								Markup.callbackButton('🧊 ➠ 💎', `swap_gems_${uuid}`),
							],
							[
								Markup.callbackButton('⬅️ Назад', `shop_${uuid}`),
								Markup.urlButton(
									'📝 Справка',
									'https://telegra.ph/Aniversecard-Sila-vseh-mificheskih-kart-07-16'
								),
							],
						])
					).HTML()
				)
		 	break
		 case 'амулеты':
				await ctx[0].editMessageText(
					ctx[0].i18n.t('swap_amulets'),
					Extra.markup(
						Markup.inlineKeyboard([
							[
								Markup.callbackButton(
									'376 🧊 крио ⇨ Сучонок 🪬',
									`s_a_first_${uuid}`
								),
							],
							[
								Markup.callbackButton(
									'792 🧊 крио ⇨ Дизантэра 🎖',
									`s_a_second_${uuid}`
								),
							],
							[
								Markup.callbackButton(
									'1200 🧊 крио ⇨ Демонёнок 🎭',
									`s_a_third_${uuid}`
								),
							],
							[
								Markup.callbackButton('🧊 ➠ 🃏', `swap_card_${uuid}`),
								Markup.callbackButton('🧊 ➠ 💎', `swap_gems_${uuid}`),
							],
							[
								Markup.callbackButton('⬅️ Назад', `shop_${uuid}`),
								Markup.urlButton(
									'📝 Справка',
									'https://telegra.ph/Aniversecard-Sila-vseh-mificheskih-kart-07-16'
								),
							],
						])
					).HTML()
				)
				ctx[0].answerCbQuery('Обмен 🔮', { cache_time: 3 })
		 	break
		 case 'самоцветы':
				await ctx[0].editMessageText(
					ctx[0].i18n.t('swap_gems'),
					Extra.markup(
						Markup.inlineKeyboard([
							[Markup.callbackButton('185 🧊 крио ⇨ 5 💎', `s_g_first_${uuid}`)],
							[Markup.callbackButton('340 🧊 крио ⇨ 15 💎', `s_g_second_${uuid}`)],
							[Markup.callbackButton('549 🧊 крио ⇨ 40 💎', `s_g_third_${uuid}`)],
							[
								Markup.callbackButton('🧊 ➠ 🔮', `swap_amulet_${uuid}`),
								Markup.callbackButton('🧊 ➠ 🃏', `swap_card_${uuid}`),
							],
							[
								Markup.callbackButton('⬅️ Назад', `shop_${uuid}`),
								Markup.urlButton(
									'📝 Справка',
									'https://telegra.ph/Aniversecard-Sila-vseh-mificheskih-kart-07-16'
								),
							],
						])
					).HTML()
				)
				ctx[0].answerCbQuery('Обмен 💎', { cache_time: 3 })
		 	break
		 case 'клановый обмен':
				await ctx[0].editMessageText(
					ctx[0].i18n.t('swap_clan_cards'),
					Extra.markup(
						Markup.inlineKeyboard([
							[
								Markup.callbackButton('9 🪙  ➠  5 🧊', `s_cl_first_c_${uuid}`),
								Markup.callbackButton('32 🪙  ➠  25 🧊', `s_cl_second_c_${uuid}`),
							],
							[
								Markup.callbackButton(
									'125 🪙  ➠  + 1 👤',
									`s_cl_place_${uuid}`
								),
							],
							[
								Markup.callbackButton('⬅️ Назад', `shop_${uuid}`),
								Markup.urlButton('📝 Справка', `https://telegra.ph/Lavka-Gildii-Komandy-10-19`),
							],
						])
					).HTML()
				)
				ctx[0].answerCbQuery('⛺️ Лавка', { cache_time: 3 })
		 	break
		 default:
		 	console.log('This component doesn"t not exist.')
		}

		ctx[0].answerCbQuery('Обмен 🃏', { cache_time: 3 })
	} catch (e) {
		console.error(e)
	}
}

// Троттлинг
let throttleSwapComponents = throttle(swapComponents, 1500)

// Actions
bot.action(new RegExp('swap_card_(.+)'), ctx => throttleSwapComponents([ctx, 'карты']))
bot.action(new RegExp('swap_amulet_(.+)'), ctx => throttleSwapComponents([ctx, 'амулеты']))
bot.action(new RegExp('swap_gems_(.+)'), ctx => throttleSwapComponents([ctx, 'самоцветы']))
bot.action(new RegExp('clShop_(.+)'), ctx => throttleSwapComponents([ctx, 'клановый обмен']))

module.exports = bot

const { Composer, Markup, Extra } = require('telegraf')
const bot = new Composer()
const User = require('../../models/user.model.js')
const Rating = require('../../models/rating.model.js')
const throttle = require('../../utils/throttle.js')

// COMPONENTS ---->
// 🏆 Ивенты AniGame 🏆
const events = async (ctx) => {
	try {
		const uuid = ctx.from.id // ID user
		const data = ctx.match[0] // Information btn
		if (data.indexOf(uuid) === -1) return // Проверка чужокого нажатия на кнопку

		await ctx.editMessageText(
			ctx.i18n.t('events'),
			Extra.markup(
				Markup.inlineKeyboard([
					[
						Markup.urlButton(
							'🧩 Найм 🎁',
							'https://telegra.ph/Najm-10-17'
						),
						Markup.callbackButton(
							'🏆 Рейтинг',
							`eRCRating_${uuid}`
						),
					],
					[
						Markup.callbackButton(
							'💥 Взлёт по БМ',
							`null_${uuid}`
						),
					],
					[
						Markup.callbackButton(
							'🎯 Баттл',
							`null_${uuid}`
						),
					],
					[
						Markup.callbackButton(
							'🧩 Баттл',
							`null_${uuid}`
						),
					],
					[
						Markup.callbackButton(
							'🏰 Битва Гильдии ⚔️',
							`null_${uuid}`
						),
					],
					[
						Markup.callbackButton(
							'🐲 Мировой Босс',
							`null_${uuid}`
						),
					],
					[
						Markup.callbackButton(
							'🧩 PVP Команда',
							`null_${uuid}`
						),
					],
					[
						Markup.callbackButton(
							'💰 Пополнения',
							`null_${uuid}`
						),
					],
					[
						Markup.callbackButton(
							'🏰 Битва за Славу 🏆',
							`null_${uuid}`
						),
					],
					[Markup.callbackButton('⬅️ Назад', `world_${uuid}`)],
				])
			).HTML()
		)

		ctx.answerCbQuery('🏆 Эвенты AniGame 🏆', { cache_time: 3 })
	} catch (e) {
		console.error(e)
	}
}

const waitingUpdateEvent = async (ctx) => {
	try {
		const uuid = ctx.from.id // ID user
		const data = ctx.match[0] // Information btn
		if (data.indexOf(uuid) === -1) return // Проверка чужокого нажатия на кнопку

		ctx.answerCbQuery('🕒 В ожидиания объявления ивента 🕒', {
			cache_time: 3,
		})
	} catch (e) {
		console.error(e)
	}
}

// Троттлинг ----->
let eventsPlayer = throttle(events, 1200)
let waitingUpdateEventPlayer = throttle(waitingUpdateEvent, 1200)

// Actions ----->
// 🏆 Ивенты AniGame 🏆
bot.action(new RegExp('events_(.+)'), ctx => eventsPlayer(ctx))

// '🕒 В ожидиания объявления ивента 🕒'
bot.action(new RegExp('null_(.+)'), ctx => waitingUpdateEventPlayer(ctx))

module.exports = bot

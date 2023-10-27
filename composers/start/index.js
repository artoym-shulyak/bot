const { Composer, Markup, Extra } = require('telegraf')
const bot = new Composer()
const User = require('../../models/user.model.js')
const Rating = require('../../models/rating.model.js')
const throttle = require('../../utils/throttle.js')

// Старт
const start = async (ctx) => {
	const uuid = String(ctx.from.id) // ID user
	const username = ctx.from.username ? String(ctx.from.username) : '' // username
	const referrer = String(ctx.message.text.split(' ')[1])

	await User.findOne({ uuid }).then(async user => {
		if (user == null) {
			await new Rating({ name: uuid, uuid, username }).save()

			await new User({ name: uuid, uuid, username })
				.save()
				.then(async user => {
					if (!user.referral.referrer) {
						await User.bulkWrite([
							{
								updateOne: {
									filter: { uuid: uuid },
									update: { $set: { 'referral.referrer': true } },
								},
							},
							{
								updateOne: {
									filter: { uuid: referrer },
									update: {
										$inc: {
											'referral.countReferrals': 1,
											'referral.todayCompleted': 1,
										},
									},
								},
							},
						]).then(async () => {
							await ctx.telegram.sendMessage(uuid,ctx.i18n.t('start', { ctx }),
								Extra.markup(m =>
									m
										.keyboard([
											['🪪 Студия', '🃏 Нанять персонажа'],
											['🏙 мир', '🧩 Мои персонажи'],
											['⛩ Таверна', '⚔️ Сражение'],
										])
										.resize()
								).HTML()
							)
						})
					}
				})
				.catch(err => console.log(err))
		} else {
			await User.updateOne({uuid}, {$set: {"username": username}})
			await ctx.telegram.sendMessage(uuid,
				ctx.i18n.t('start', { ctx }),
				Extra.markup(m =>
					m
						.keyboard([
							['🪪 Студия', '🃏 Нанять персонажа'],
							['🏙 мир', '🧩 Мои персонажи'],
							['⛩ Таверна', '⚔️ Сражение'],
						])
						.resize()
				).HTML()
			)
		}
	})
}

// Троттлинг
let throttleStart = throttle(start, 3000)

// Actions
bot.command('/start', ctx => throttleStart(ctx))

// Command => /start
// bot.hears(new RegExp('серверы', 'i'), async ctx => {
// 	try {
// 		const uuid = String(ctx.from.id)

// 		await ctx.telegram.sendMessage(uuid,
// 				ctx.i18n.t('server', { ctx }),
// 				Extra.markup(
// 					Markup.inlineKeyboard([
// 						Markup.callbackButton('Новый сервер', `new_server_${uuid}`),
// 						Markup.callbackButton('Выбрать сервер', `choise_server_${uuid}`),
// 					])
// 				).HTML()
// 			)
// 			.catch(err => console.log(err))
// 	} catch (e) {
// 		console.error(e)
// 	}
// })

// Btn => 'Новый Сервер'
// bot.action(new RegExp('new_server_(.+)'), async ctx => {
// 	try {
// 		const uuid = ctx.from.id // ID user
// 		const data = ctx.match[0] // Information btn
// 		if (data.indexOf(uuid) === -1) return // Проверка чужокого нажатия на кнопку

// 		ctx.answerCbQuery('🛠 Не скоро 🛠', { cache_time: 3 })
// 	} catch (e) {
// 		console.error(e)
// 	}
// })

// // Btn => 'Выбрать сервер'
// bot.action(new RegExp('choise_server_(.+)'), async ctx => {
// 	try {
// 		const uuid = ctx.from.id // ID user
// 		const data = ctx.match[0] // Information btn
// 		if (data.indexOf(uuid) === -1) return // Проверка чужокого нажатия на кнопку

// 		ctx.answerCbQuery('🛠 Не скоро 🛠', { cache_time: 3 })

// 		return
// 	} catch (e) {
// 		console.error(e)
// 	}
// })

module.exports = bot

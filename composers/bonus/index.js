const { Composer, Markup, Extra } = require('telegraf')
const bot = new Composer()
const User = require('../../models/user.model.js')
const _shuffle = require('../../utils/shuffle.js')
const throttle = require('../../utils/throttle.js')

// Random numbers for bonus
let numberForGetBonus = [1, 2, 3, 4, 5, 6, 7, 8, 9]

// Бонус
const bonus = async (ctx) => {
	try {
		const uuid = ctx.from.id // ID user
		const data = ctx.match[0] // Information btn
		if (data.indexOf(uuid) === -1) return // Проверка чужокого нажатия на кнопку
		let btns = await _shuffle(numberForGetBonus)

		await User.findOne({ uuid }).then(async user => {
			if (new Date() < user.deadlines.bonus.deadline) {
				console.log(new Date().toLocaleString('ru-RU'))
				await ctx.replyWithHTML(
					`🍀 Возвращайся за бонусом в <strong>${user.deadlines.bonus.deadline
						.toLocaleString('ru-RU')
						.split(',')[1]
						.trim()}</strong> (МСК).`
				)
			} else {
				// Книга 7 дней
				if (
					new Date() > user.deadlines.bookFirst.deadline &&
					user.deadlines.bookFirst.state === true
				) {
					await User.updateOne(
						{ uuid },
						{
							$set: {
								'deadlines.bookFirst.state': false,
								'resources.books.first': false,
								'deadlines.bookFirst.deadline': 0,
							}
						}
					).then(async () => {
						await ctx.telegram.sendMessage(
							uuid,
							'Время исткело ➻ 📗 <strong>Поднятия уровня в одиночку</strong>.',
							{ parse_mode: 'HTML' }
						)
					})
				}
				// Книга 14 дней
				if (
					new Date() > user.deadlines.bookSecond.deadline &&
					user.deadlines.bookSecond.state === true
				) {
					await User.updateOne(
						{ uuid },
						{
							$set: {
								'deadlines.bookSecond.state': false,
								'resources.books.second': false,
								'deadlines.bookSecond.deadline': 0,
							}
						}
					).then(async () => {
						await ctx.telegram.sendMessage(
							uuid,
							'Время исткело ➻ 📘 <strong>Райские игры</strong>.',
							{ parse_mode: 'HTML' }
						)
					})
				}
				// Книга 27 дней
				if (
					new Date() > user.deadlines.bookThird.deadline &&
					user.deadlines.bookThird.state === true
				) {
					await User.updateOne(
						{ uuid },
						{
							$set: {
								'deadlines.bookThird.state': false,
								'resources.books.third': false,
								'deadlines.bookThird.deadline': 0,
							}
						}
					).then(async () => {
						await ctx.telegram.sendMessage(
							uuid,
							'Время исткело ➻ 📕 <strong>Тетрадь смерти</strong>.',
							{ parse_mode: 'HTML' }
						)
					})
				}

				await User.updateOne(
					{ uuid },
					{
						$set: {
							'deadlines.bonus.deadline': new Date(
								Date.parse(new Date()) + user.deadlines.bonus.term  * 60 * 60 * 1000
							),
						},
					}
				).then(async () => {
					await ctx.reply(
						ctx.i18n.t('🍀 Бонус'),
						Extra.markup(
							Markup.inlineKeyboard([
								[
									Markup.callbackButton('🕋', `getBonus_${btns[0]}_${uuid}`),
									Markup.callbackButton('🕋', `getBonus_${btns[1]}_${uuid}`),
									Markup.callbackButton('🕋', `getBonus_${btns[2]}_${uuid}`),
								],
								[
									Markup.callbackButton('🕋', `getBonus_${btns[3]}_${uuid}`),
									Markup.callbackButton('🕋', `getBonus_${btns[4]}_${uuid}`),
									Markup.callbackButton('🕋', `getBonus_${btns[5]}_${uuid}`),
								],
								[
									Markup.callbackButton('🕋', `getBonus_${btns[6]}_${uuid}`),
									Markup.callbackButton('🕋', `getBonus_${btns[7]}_${uuid}`),
									Markup.callbackButton('🕋', `getBonus_${btns[8]}_${uuid}`),
								],
							])
						).HTML()
					)
				})
			}
		})

		ctx.answerCbQuery('🍀 Бонус', { cache_time: 3 })
	} catch (e) {
		console.error(e)
	}
}

// Получить бонус
const getBonus = async (ctx) => {
	try {
		const uuid = ctx[0].from.id // ID user
		const data = ctx[0].match[0] // Information btn
		if (data.indexOf(uuid) === -1) return // Проверка чужокого нажатия на кнопку

		ctx[0].deleteMessage()

		switch (ctx[1]) {
		  case '🧊':
					await User.updateOne({ uuid }, { $inc: { "resources.crio": ctx[2] } }).then(
						async () => {
							await ctx[0].replyWithHTML(ctx[0].i18n.t('Получение_Бонуса', { bonus: `${ctx[2]} 🧊` }))
						}
					)
					ctx[0].answerCbQuery(`Получено ${ctx[2]} ${ctx[1]}`, { cache_time: 3 })
		    break;
		  case '🃏':
					await User.updateOne({ uuid }, { $inc: { "resources.recrute": ctx[2] } }).then(
						async () => {
							await ctx[0].replyWithHTML(ctx[0].i18n.t('Получение_Бонуса', { bonus: `${ctx[2]} 🃏` }))
						}
					)
					ctx[0].answerCbQuery(`Получено ${ctx[2]} ${ctx[1]}`, { cache_time: 3 })
		    break;
		  case '💎':
					await User.updateOne({ uuid }, { $inc: { "resources.gems": ctx[2] } }).then(
						async () => {
							await ctx[0].replyWithHTML(ctx[0].i18n.t('Получение_Бонуса', { bonus: `${ctx[2]} 💎` }))
						}
					)
					ctx[0].answerCbQuery(`Получено ${ctx[2]} ${ctx[1]}`, { cache_time: 3 })
		    break;
		  case '💥':
					await User.updateOne({ uuid }, { $inc: { "stats.bm": ctx[2] } }).then(
						async () => {
							await ctx[0].replyWithHTML(ctx[0].i18n.t('Получение_Бонуса', { bonus: `${ctx[2]} 💥` }))
						}
					)
					ctx[0].answerCbQuery(`Получено ${ctx[2]} ${ctx[1]}`, { cache_time: 3 })
		    break;
		  case '❤️':
					await User.updateOne({ uuid }, { $inc: { "stats.hp": ctx[2] } }).then(
						async () => {
							await ctx[0].replyWithHTML(ctx[0].i18n.t('Получение_Бонуса', { bonus: `${ctx[2]} ❤️` }))
						}
					)
					ctx[0].answerCbQuery(`Получено ${ctx[2]} ${ctx[1]}`, { cache_time: 3 })
		    break;

		  default:
		    console.log('This bonus does not exist.')
		}
	} catch (e) {
		console.error(e)
	}
}

// Троттлинг
let throttleBonus = throttle(bonus, 1500)
let throttleGetBonus = throttle(getBonus, 1500)

// Actions
bot.action(new RegExp('bonus_(.+)'), ctx => throttleBonus(ctx))
bot.action(new RegExp('getBonus_1_(.+)'), ctx => throttleGetBonus([ctx, "🧊", 1]))
bot.action(new RegExp('getBonus_2_(.+)'), ctx => throttleGetBonus([ctx, "🧊", 2]))
bot.action(new RegExp('getBonus_3_(.+)'), ctx => throttleGetBonus([ctx, "🧊", 3]))
bot.action(new RegExp('getBonus_4_(.+)'), ctx => throttleGetBonus([ctx, "🃏", 1]))
bot.action(new RegExp('getBonus_5_(.+)'), ctx => throttleGetBonus([ctx, "🃏", 2]))
bot.action(new RegExp('getBonus_6_(.+)'), ctx => throttleGetBonus([ctx, "💎", 1]))
bot.action(new RegExp('getBonus_7_(.+)'), ctx => throttleGetBonus([ctx, "🧊", 10]))
bot.action(new RegExp('getBonus_8_(.+)'), ctx => throttleGetBonus([ctx, "💥", 1000]))
bot.action(new RegExp('getBonus_9_(.+)'), ctx => throttleGetBonus([ctx, "❤️", 1000]))

module.exports = bot

// Команды для Админов ---->
// 1) Дать карты [ кол-во карты ] + [ ID игрока ] ✅
// 2) Дать крио [ кол-во карты ] + [ ID игрока ] ✅
// 3) Дать самоцветы [ кол-во самоцветов ] + [ ID игрока ] ✅
// 4) Дать амулет [ номер амулета ] + [ ID игрока ] ✅
// 5) Смена ника [ новый ник игрока ] на [ ID игрока ] ✅
// 6) Обновить кол-во попыток ника [ ID игрока ] ✅
// 7) Дать бм [ кол-во бм ] + [ ID игрока ] ✅
// 8) Дать бс [ кол-во бм ] + [ ID игрока ] ✅
// 9) Дать персонажа [ ID игрока ] + [ ID персонажа ] ✅
// 10) Таймер бонуса [ ID игрока ] + [ кол-во часов ] ✅
// 11) Дать книгу [ номер книги ] + [ ID игрока ] ✅
// 12) Продлить книгу [ номер книги ] + [ ID игрока ] ✅
// 13) Дать монеты [ кол-во монет ] + [ наименование Гильдии ] ✅
// 14) .найти [ ID игрока ] ✅
// 15) Инфа [ сообщение игрока ] ✅
// 16) Дать с [ число ] по [ число ] [ сделать 5-ять пробелов ] [ выбор: карты, самоцветы, бм, хп, крио ] + [ кол-во ] ✅

const { Composer, Extra, Markup } = require('telegraf')
const bot = new Composer()
const User = require('../../models/user.model.js')
const Clan = require('../../models/clan.model.js')
const Rating = require('../../models/rating.model.js')
const Characters = require('../../models/characters.model.js')
const sleep = require('../../utils/sleep.js')

//  Дать карты [ кол-во карты ] + [ ID игрока ]
bot.hears(/\дать карты(.+)/i, async ctx => {
	try {
		if (ctx.from.id != 257083558) return
		let count = ctx.message.text
			.split('+')[0]
			.replace(/дать карты/i, '')
			.trim()
		let uuid = ctx.message.text.split('+')[1].trim()

		if (await User.findOne({uuid}) == null) return

		await User.updateOne(
			{ uuid },
			{ $inc: { 'resources.recrute': +count } }
		).then(async () => {
			await ctx.telegram.sendMessage(
				uuid,
				`‼🤖 <i>Администрация бота выдала тебе кол-во карт</i> ➻ <strong>${count} 🃏</strong>`,
				{
					parse_mode: 'HTML',
				}
			)
		})
	} catch (e) {
		console.error(e)
	}
})

// Дать крио [ кол-во карты ] + [ iD игрока ]
bot.hears(/\дать крио(.+)/i, async ctx => {
	try {
		if (ctx.from.id != 257083558) return
		let count = ctx.message.text
			.split('+')[0]
			.replace(/дать крио/i, '')
			.trim()
		let uuid = ctx.message.text.split('+')[1].trim()

		if (await User.findOne({uuid}) == null) return

		await User.updateOne({ uuid }, { $inc: { 'resources.crio': +count } }).then(
			async () => {
				await ctx.telegram.sendMessage(
					uuid,
					`‼🤖 <i>Администрация бота выдала тебе кол-во крионитов</i> ➻ <strong>${count} 🧊</strong>`,
					{
						parse_mode: 'HTML',
					}
				)
			}
		)
	} catch (e) {
		console.error(e)
	}
})

// Дать крио [ кол-во самоцветов ] + [ ID игрока ]
bot.hears(/\дать самоцветы(.+)/i, async ctx => {
	try {
		if (ctx.from.id != 257083558) return
		let count = ctx.message.text
			.split('+')[0]
			.replace(/дать самоцветы/i, '')
			.trim()
		let uuid = ctx.message.text.split('+')[1].trim()

		if (await User.findOne({uuid}) == null) return

		await User.updateOne({ uuid }, { $inc: { 'resources.gems': +count } }).then(
			async () => {
				await ctx.telegram.sendMessage(
					uuid,
					`‼🤖 <i>Администрация бота выдала тебе кол-во самоцветов</i> ➻ <strong>${count} 💎</strong>`,
					{
						parse_mode: 'HTML',
					}
				)
			}
		)
	} catch (e) {
		console.error(e)
	}
})

// Дать амулет [ номер амулета ] + [ ID игрока ]
bot.hears(/\дать амулет 1(.+)/i, async ctx => {
	try {
		if (ctx.from.id != 257083558) return
		let uuid = await ctx.message.text.replace(/дать амулет 1/i, '').trim()

		if (await User.findOne({uuid}) == null) return

		await User.updateOne(
			{ uuid },
			{
				$set: { 'resources.amulets.first': true },
				$inc: {
					'stats.bm': 300000,
					'stats.hp': 475000,
					'resources.recrute': 10,
				},
			}
		).then(async () => {
			await ctx.telegram.sendMessage(
				uuid,
				`‼🤖 <i>Администрация бота выдала тебе амулет</i> <strong>➻🪬 Сучонок</strong>.`,
				{
					parse_mode: 'HTML',
				}
			)
		})
	} catch (e) {
		console.error(e)
	}
})

// Дать амулет [ номер амулета ] + [ ID игрока ]
bot.hears(/\дать амулет 2(.+)/i, async ctx => {
	try {
		if (ctx.from.id != 257083558) return
		let uuid = await ctx.message.text.replace(/дать амулет 2/i, '').trim()

	  if (await User.findOne({uuid}) == null) return

		await User.updateOne(
			{ uuid },
			{
				$set: { 'resources.amulets.second': true },
				$inc: {
					'stats.bm': 512000,
					'stats.hp': 745000,
					'resources.recrute': 21,
				},
			}
		).then(async () => {
			await ctx.telegram.sendMessage(
				uuid,
				`‼🤖 <i>Администрация бота вручила тебе амулет</i> <strong>➻🎖 Дизантэра</strong>.`,
				{
					parse_mode: 'HTML',
				}
			)
		})
	} catch (e) {
		console.error(e)
	}
})

// Дать амулет [ номер амулета ] + [ ID игрока ]
bot.hears(/\дать амулет 3(.+)/i, async ctx => {
	try {
		if (ctx.from.id != 257083558) return
		let uuid = await ctx.message.text.replace(/дать амулет 3/i, '').trim()

  if (await User.findOne({uuid}) == null) return

		await User.updateOne(
			{ uuid },
			{
				$set: { 'resources.amulets.third': true },
				$inc: {
					'stats.bm': 925000,
					'resources.recrute': 30,
				},
			}
		).then(async () => {
			await ctx.telegram.sendMessage(
				uuid,
				`‼️ <i>Администрация бота вручила тебе амулет</i> <strong>➻🎭 Демонёнок</strong>.`,
				{
					parse_mode: 'HTML',
				}
			)
		})
	} catch (e) {
		console.error(e)
	}
})

// Смена ника [ новый ник игрока ] на [ ID игрока ]
bot.hears(/\обновить ник(.+)/i, async ctx => {
	try {
		if (ctx.from.id != 257083558) return
		let uuid = await ctx.message.text
			.split('на')[0]
			.replace(/обновить ник/i, '')
			.trim()
		let name = await ctx.message.text.split('на')[1].trim()

  if (await User.findOne({uuid}) == null) return

		await User.updateOne({ uuid }, { $set: { name: name } }).then(async () => {
			await ctx.telegram.sendMessage(
				uuid,
				`‼🤖 <i>Администрация бота изменила тебе имя на </i> <strong>${name}</strong>`,
				{
					parse_mode: 'HTML',
				}
			)
		})
	} catch (e) {
		console.error(e)
	}
})

// Обновить кол-во попыток ника [ ID игрока ]
bot.hears(/\обновить кол-во попыток ника(.+)/i, async ctx => {
	try {
		if (ctx.from.id != 257083558) return
		let uuid = await ctx.message.text
			.replace(/обновить кол-во попыток ника/i, '')
			.trim()

  if (await User.findOne({uuid}) == null) return

		await User.updateOne({ uuid }, { $set: { countName: 0 } }).then(
			async () => {
				await ctx.telegram.sendMessage(
					uuid,
					`‼🤖 <i>Администрация бота обнулила тебе котл-во попыток к нулю.</i>`,
					{
						parse_mode: 'HTML',
					}
				)
			}
		)
	} catch (e) {
		console.error(e)
	}
})

// Дать бм [ кол-во бм ] + [ ID игрока ]
bot.hears(/\дать бм(.+)/i, async ctx => {
	try {
		if (ctx.from.id != 257083558) return
		let count = await ctx.message.text
			.split('+')[0]
			.replace(/дать бм/i, '')
			.trim()
		let uuid = await ctx.message.text.split('+')[1].trim()

  if (await User.findOne({uuid}) == null) return

		await User.updateOne({ uuid }, { $inc: { 'stats.bm': +count } }).then(
			async () => {
				await ctx.telegram.sendMessage(
					uuid,
					`‼🤖 <i>Администрация бота прибавила к твоей Боевой Мощи</i> ➻<strong>💥${count}</strong>`,
					{
						parse_mode: 'HTML',
					}
				)
			}
		)
	} catch (e) {
		console.error(e)
	}
})

// Дать хп [ кол-во хр ] + [ ID игрока ]
bot.hears(/\дать хп(.+)/i, async ctx => {
	try {
		if (ctx.from.id != 257083558) return
		let count = await ctx.message.text
			.split('+')[0]
			.replace(/дать хп/i, '')
			.trim()
		let uuid = await ctx.message.text.split('+')[1].trim()

  if (await User.findOne({uuid}) == null) return

		await User.updateOne({ uuid }, { $inc: { 'stats.hp': +count } }).then(
			async () => {
				await ctx.telegram.sendMessage(
					uuid,
					`‼🤖 <i>Администрация бота прибавила к твоей Живучести</i> ➻ <strong>❤️${count}</strong>`,
					{
						parse_mode: 'HTML',
					}
				)
			}
		)
	} catch (e) {
		console.error(e)
	}
})

// Таймер бонуса [ ID игрока ] + [ кол-во часов ]
bot.hears(/\таймер бонуса(.+)/i, async ctx => {
	try {
		if (ctx.from.id != 257083558) return
		let uuid = await ctx.message.text
			.split('+')[0]
			.replace(/таймер бонуса/i, '')
			.trim()
		let count = await ctx.message.text.split('+')[1].trim()

  if (await User.findOne({uuid}) == null) return

		await User.updateOne(
			{ uuid },
			{ $set: { 'deadlines.bonus.term': +count } }
		).then(async () => {
			await ctx.telegram.sendMessage(
				uuid,
				`‼🤖 <i>Администрация бота обновил тебе получения бонуса каждые</i> ➻ <strong>${count} ч.</strong>`,
				{
					parse_mode: 'HTML',
				}
			)
		})
	} catch (e) {
		console.error(e)
	}
})

// Дать книгу [ номер книги ] + [ ID игрока ]
bot.hears(/\дать книгу 1(.+)/i, async ctx => {
	try {
		if (ctx.from.id != 257083558) return
		const text = await ctx.message.text.toLowerCase() // TEXT user
		let uuid = await ctx.message.text.replace(/дать книгу 1/i, '').trim()

  if (await User.findOne({uuid}) == null) return

		await User.updateOne(
			{ uuid },
			{
				$set: {
					'resources.books.first': true,
					'deadlines.bookFirst.deadline': new Date(
						Date.parse(new Date()) + 7 * 24 * 60 * 60 * 1000
					),
					'deadlines.bookFirst.state': true,
				},
				$inc: { 'stats.hp': 3000, 'resources.recrute': 1 },
			}
		).then(async () => {
			await ctx.telegram.sendMessage(
				uuid,
				'‼🤖 <i>Администрация бота выдала тебе книгу</i> ➻ 📘 <strong>Ича Ича</strong>.',
				{ parse_mode: 'HTML' }
			)
		})
	} catch (e) {
		console.error(e)
	}
})

// Дать книгу [ номер книги ] + [ ID игрока ]
bot.hears(/\дать книгу 2(.+)/i, async ctx => {
	try {
		if (ctx.from.id != 257083558) return
		const text = await ctx.message.text.toLowerCase() // TEXT user
		let uuid = await ctx.message.text.replace(/дать книгу 2/i, '').trim()

  if (await User.findOne({uuid}) == null) return

		await User.updateOne(
			{ uuid },
			{
				$set: {
					'resources.books.second': true,
					'deadlines.bookSecond.deadline': new Date(
						Date.parse(new Date()) + 14 * 24 * 60 * 60 * 1000
					),
					'deadlines.bookSecond.state': true,
				},
				$inc: { 'stats.hp': 5000, 'stats.bm': 5000 },
			}
		).then(async () => {
			await ctx.telegram.sendMessage(
				uuid,
				'‼🤖 <i>Администрация бота выдала тебе книгу</i> ➻ 📗 <strong>Solo Leaving</strong>.',
				{ parse_mode: 'HTML' }
			)
		})
	} catch (e) {
		console.error(e)
	}
})

// Дать книгу [ номер книги ] + [ ID игрока ]
bot.hears(/\дать книгу 3(.+)/i, async ctx => {
	try {
		if (ctx.from.id != 257083558) return
		const text = await ctx.message.text.toLowerCase() // TEXT user
		let uuid = await ctx.message.text.replace(/дать книгу 3/i, '').trim()

  if (await User.findOne({uuid}) == null) return

		await User.updateOne(
			{ uuid },
			{
				$set: {
					'resources.books.third': true,
					'deadlines.bookThird.deadline': new Date(
						Date.parse(new Date()) + 27 * 24 * 60 * 60 * 1000
					),
					'deadlines.bookThird.state': true,
				},
				$inc: { 'stats.hp': 24000, 'stats.bm': 12000, 'resources.recrute': 5 },
			}
		).then(async () => {
			await ctx.telegram.sendMessage(
				uuid,
				'‼🤖 <i>Администрация бота выдала тебе книгу</i> ➻ 📕 <strong>Тетрадь смерти</strong>.',
				{ parse_mode: 'HTML' }
			)
		})
	} catch (e) {
		console.error()
	}
})

// Продлить книгу [ номер книги ] + [ ID игрока ]
bot.hears(/\продлить книгу 1(.+)/i, async ctx => {
	try {
		if (ctx.from.id != 257083558) return
		const text = await ctx.message.text.toLowerCase() // TEXT user
		let uuid = await ctx.message.text.replace(/продлить книгу 1/i, '').trim()

  if (await User.findOne({uuid}) == null) return

		await User.findOne({ uuid }).then(async user => {
			const currentDate = await user.deadlines.bookFirst.deadline
			currentDate.setDate(currentDate.getDate() + 7)
			await User.updateOne(
				{ uuid },
				{
					$set: { 'deadlines.bookFirst.deadline': currentDate },
				}
			).then(async () => {
				await ctx.telegram.sendMessage(
					uuid,
					'‼🤖 <i>Администрация бота продлила тебе книгу</i> ➻ 📗 <strong>Поднятия уровня в одиночку</strong>.',
					{ parse_mode: 'HTML' }
				)
			})
		})
	} catch (e) {
		console.error(e)
	}
})

// Продлить книгу [ номер книги ] + [ ID игрока ]
bot.hears(/\продлить книгу 2(.+)/i, async ctx => {
	try {
		if (ctx.from.id != 257083558) return
		const text = await ctx.message.text.toLowerCase() // TEXT user
		let uuid = await ctx.message.text.replace(/продлить книгу 2/i, '').trim()

  if (await User.findOne({uuid}) == null) return

		await User.findOne({ uuid }).then(async user => {
			const currentDate = await user.deadlines.bookFirst.deadline
			currentDate.setDate(currentDate.getDate() + 7)
			await User.updateOne(
				{ uuid },
				{ $set: { 'deadlines.bookSecond.deadline': currentDate } }
			).then(async () => {
				await ctx.telegram.sendMessage(
					uuid,
					'‼🤖 <i>Администрация бота продлила тебе книгу</i> ➻ 📘 <strong>Райские игры</strong>.',
					{ parse_mode: 'HTML' }
				)
			})
		})
	} catch (e) {
		console.error(e)
	}
})

// Продлить книгу [ номер книги ] + [ ID игрока ]
bot.hears(/\продлить книгу 3(.+)/i, async ctx => {
	try {
		if (ctx.from.id != 257083558) return
		const text = await ctx.message.text.toLowerCase() // TEXT user
		let uuid = await ctx.message.text.replace(/продлить книгу 3/i, '').trim()

  if (await User.findOne({uuid}) == null) return

		await User.findOne({ uuid }).then(async user => {
			const currentDate = await user.deadlines.bookFirst.deadline
			currentDate.setDate(currentDate.getDate() + 7)
			await User.updateOne(
				{ uuid },
				{ $set: { 'deadlines.bookThird.deadline': currentDate } }
			).then(async () => {
				await ctx.telegram.sendMessage(
					uuid,
					'‼🤖 <i>Администрация бота продлила тебе книгу</i> ➻ 📕 <strong>Тетрадь смерти</strong>.',
					{ parse_mode: 'HTML' }
				)
			})
		})
	} catch (e) {
		console.error()
	}
})

// Дать монеты [ кол-во монет ] + [ наименование Гильдии ]
bot.hears(/\дать монеты(.+)/i, async ctx => {
	try {
		if (ctx.from.id != 257083558) return
		let count = await ctx.message.text
			.split('+')[0]
			.replace(/дать монеты/i, '')
			.trim()
		let name = await ctx.message.text.split('+')[1].trim()

  if (await User.findOne({uuid}) == null) return

		await Clan.updateOne({ name }, { $inc: { money: +count } }).then(
			async () => {
				await ctx.replyWithHTML(
					`‼🤖 <i>Успешно были отправлены кол-во монет</i> ➻ <strong>${count}</strong>`
				)
			}
		)
	} catch (e) {
		console.error(e)
	}
})

// .найти [ ID игрока ]
bot.hears(/\.найти(.+)/i, async ctx => {
	try {
		let uuid = await ctx.message.text.replace(/.найти/i, '').trim()

		if (await User.findOne({uuid}) == null) return

		await User.findOne({ uuid }).then(async user => {
			console.log(user.name)
			await ctx.reply(
				ctx.i18n.t('infoPlayer', {
					user,
					clan: (await user.clan.name) !== 'null' ? await user.clan.name : '-',
				}),
				Extra.markup(
					Markup.inlineKeyboard([
						[
							Markup.urlButton(
								'✉️ Написать сообщение',
								`https://t.me/${user.username}`
							),
						],
						[Markup.callbackButton('⚔️ Атаковать', `info_attack_${user.uuid}`)],
					])
				).HTML()
			)
		})
	} catch (e) {
		console.error(e)
	}
})

// Инфа [ сообщение игрока ]
bot.hears(new RegExp('инфа', 'i'), async ctx => {
	try {
		const uuid = await String(ctx.from.id) // ID user
		const uuidPlayer = await ctx.message.reply_to_message.from.id // ID user
		const userName = await ctx.message.reply_to_message.from.username

  if (await User.findOne({uuid}) == null) return
		
		await User.findOne({ uuid: uuidPlayer }).then(async user => {
			await ctx.reply(
				ctx.i18n.t('infoPlayer', {
					user,
					clan: (await user.clan.name) !== 'null' ? await user.clan.name : '-',
				}),
				Extra.markup(
					Markup.inlineKeyboard([
						[
							Markup.urlButton(
								'✉️ Написать сообщение',
								`https://t.me/${userName}`
							),
						],
						[
							Markup.callbackButton(
								'⚔️ Атаковать',
								`info_attack_${uuidPlayer}`
							),
						],
					])
				).HTML()
			)
		})
	} catch (e) {
		console.error(e)
	}
})

// Дать с [ число ] по [ число ] [ сделать 5-ять пробелов ] [ выбор: карты, самоцветы, бм, хп, крио ] + [ кол-во ]
bot.hears(/\дать(.+)/i, async ctx => {
	try {
		if (ctx.from.id != 257083558) return
		let from = ctx.message.text
			.split('по')[0]
			.replace(/дать с/i, '')
			.trim()
		let to = ctx.message.text.split('по')[1].substring(0, 4).trim()
		let count = ctx.message.text.split('+')[1].trim()
		let res = ''

  if (await User.findOne({uuid}) == null) return

		if (ctx.message.text.indexOf('карты') != -1) {
			res = { 'resources.recrute': +count }
			console.log(from, to, count, 1)
		}

		if (ctx.message.text.indexOf('самоцветы') != -1) {
			res = { 'resources.gems': +count }
			console.log(from, to, count, 2)
		}

		if (ctx.message.text.indexOf('бм') != -1) {
			res = { 'stats.bm': +count }
			console.log(from, to, count, 3)
		}

		if (ctx.message.text.indexOf('хп') != -1) {
			res = { 'stats.hp': +count }
			console.log(from, to, count, 4)
		}

		if (ctx.message.text.indexOf('крио') != -1) {
			res = { 'resources.crio': +count }
			console.log(from, to, count, 5)
		}

		User.updateMany(
			{ 'placeEvents.recruteChar': { $gte: +from, $lte: +to } },
			{ $inc: res }
		).then(res => console.log(res))
	} catch (e) {
		console.error(e)
	}
})

module.exports = bot

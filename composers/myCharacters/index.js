const { Composer, Markup, Extra } = require('telegraf')
const bot = new Composer()
const User = require('../../models/user.model.js')
const Characters = require('../../models/characters.model.js')
const throttle = require('../../utils/throttle.js')

// Список персонажей с пагинацией
async function arrowsCharacters(ctx, uuid, ckeck = null) {
	let listOfCharacters = ''
	let usersOfCharacters = ''

	await User.findOne({ uuid }).then(async user => {
		if (user == null) return
		let offset = await user.pagesMyCharacters.offset
		let page = await user.pagesMyCharacters.page
		let countPages = Math.ceil(user.characters.length / 10)
		let characters = await Characters.find()

		usersOfCharacters = user.characters
			.map(id => {
				return characters[id]
			})
			.sort(function (a, b) {
				return b.stats.bm - a.stats.bm
			})

		await usersOfCharacters.forEach((char, i) => {
			if (i >= 0 + offset && i < 10 + offset) {
				listOfCharacters += `${i + 1}. <code>${char.name}</code> ➻💥${
					char.stats.bm
				} | ❤️ ${char.stats.hp} (${char.rank})\n🧩 Посмотреть: /f${
					char.hashtag
				}\n`
			}
		})

		if (ckeck === 'default') {
			if (user.characters.length < 10) {
				// кол-во персонажей < ...
				await ctx.reply(ctx.i18n.t('my_characters', { listOfCharacters }), {
					parse_mode: 'HTML',
				})
			} else {
				await ctx.reply(
					ctx.i18n.t('my_characters', { listOfCharacters }),
					Extra.markup(
						Markup.inlineKeyboard([
							Markup.callbackButton(`${page} / ${countPages}`, 'null'),
							Markup.callbackButton('➡️', `next_${uuid}`),
						])
					).HTML()
				)
			}
		} else {
			switch (true) {
			 case page === 1:
					await ctx.editMessageText(
						ctx.i18n.t('my_characters', { listOfCharacters }),
						Extra.markup(
							Markup.inlineKeyboard([
								Markup.callbackButton(`${page} / ${countPages}`, 'null'),
								Markup.callbackButton('➡️', `next_${uuid}`),
							])
						).HTML()
					)
			 	break
			 case page === countPages:
					await ctx.editMessageText(
						ctx.i18n.t('my_characters', { listOfCharacters }),
						Extra.markup(
							Markup.inlineKeyboard([
								Markup.callbackButton('⬅️', `prev_${uuid}`),
								Markup.callbackButton(`${page} / ${countPages}`, 'null'),
							])
						).HTML()
					)
			 	break
			 default:
					await ctx.editMessageText(
						ctx.i18n.t('my_characters', { listOfCharacters }),
						Extra.markup(
							Markup.inlineKeyboard([
								Markup.callbackButton('⬅️', `prev_${uuid}`),
								Markup.callbackButton(`${page} / ${countPages}`, 'null'),
								Markup.callbackButton('➡️', `next_${uuid}`),
							])
						).HTML()
					)
			 	break 
			}
		}
	})
}

// Мои персонажи
const arrowsMyCharacters = async (ctx) => {
	try {
		if (ctx[0].updateType === 'callback_query') {
			const data = ctx[0].match[0]
			if (data.indexOf(ctx[1]) === -1) return
		 ctx[0].answerCbQuery('🧩 Мои персонажи', { cache_time: 3 })
		} 
		switch (ctx[2]) {
		 case 'next':
				await User.updateOne({uuid:ctx[1]},{ $inc: { 'pagesMyCharacters.page': 1, 'pagesMyCharacters.offset': 10 } })
				.then(async () => {
					await arrowsCharacters(ctx[0], ctx[1], 'next')
				})
		 	break
		 case 'prev':
				await User.updateOne({uuid:ctx[1]},{ $inc: { 'pagesMyCharacters.page': -1, 'pagesMyCharacters.offset': -10 } })
				.then(async () => {
					await arrowsCharacters(ctx[0], ctx[1], 'prev')
				})
		 	 break
		 default:
				await User.updateOne({uuid:ctx[1]},{ $set: { 'pagesMyCharacters.page': 1, 'pagesMyCharacters.offset': 0 } })
				.then(async (res) => {
					await arrowsCharacters(ctx[0], ctx[1], 'default')
				})
		}
	} catch (e) {
		console.error(e)
	}
}

let throttleArrowsMyCharacters = throttle(arrowsMyCharacters, 1500)

// Hears => 'мои персонажи'
bot.hears(/мои персонажи/i, ctx => throttleArrowsMyCharacters([ctx, ctx.from.id, 'default']))
bot.action(new RegExp('next_(.+)'), ctx => throttleArrowsMyCharacters([ctx, ctx.from.id, 'next']))
bot.action(new RegExp('prev_(.+)'), ctx => throttleArrowsMyCharacters([ctx, ctx.from.id, 'prev']))

module.exports = bot

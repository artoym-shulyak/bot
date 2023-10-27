const { Composer, Markup, Extra } = require('telegraf')
const bot = new Composer()
const throttle = require('../../utils/throttle.js')

// Библиотека
const book = async (ctx) => {
	try {
		const uuid = String(ctx[0].from.id) // ID user
		const data = ctx[0].match[0] // Information btn
		if (data.indexOf(uuid) === -1) return // Проверка чужокого нажатия на кнопку

  switch (ctx[1]) {
   case 'главная':
				await ctx[0].editMessageText(
					ctx[0].i18n.t('books'),
					Extra.markup(
						Markup.inlineKeyboard([
							[Markup.callbackButton('📘 Ича Ича', `book_first_${uuid}`)],
							[
								Markup.callbackButton(
									'📗 Solo Leaving',
									`book_second_${uuid}`
								),
							],
							[Markup.callbackButton('📕 Тетрадь смерти', `book_third_${uuid}`)],
							[Markup.callbackButton('⬅️ Назад', `shop_${uuid}`)],
						])
					).HTML()
				)

				ctx[0].answerCbQuery('📚 Библиотека', { cache_time: 3 })

   	break
   case '1':
				await ctx[0].editMessageText(
					ctx[0].i18n.t('b_first'),
					Extra.markup(
						Markup.inlineKeyboard([
							[Markup.callbackButton('💰 Купить за 499 ₽', `b_donat_${uuid}`)],
							[Markup.callbackButton('⬅️ Назад', `books_${uuid}`)],
						])
					).HTML()
				)
				ctx[0].answerCbQuery('📘 Ича Ича', { cache_time: 3 })
   	break
   case '2':
				await ctx[0].editMessageText(
					ctx[0].i18n.t('b_second'),
					Extra.markup(
						Markup.inlineKeyboard([
							[Markup.callbackButton('💰 Купить за 1295 ₽', `b_donat_${uuid}`)],
							[Markup.callbackButton('⬅️ Назад', `books_${uuid}`)],
						])
					).HTML()
				)
				ctx[0].answerCbQuery('📗 Solo Leaving', { cache_time: 3 })
   	break
   case '3':
				await ctx[0].editMessageText(
					ctx[0].i18n.t('b_third'),
					Extra.markup(
						Markup.inlineKeyboard([
							[Markup.callbackButton('💰 Купить за 1920 ₽', `b_donat_${uuid}`)],
							[Markup.callbackButton('⬅️ Назад', `books_${uuid}`)],
						])
					).HTML()
				)
				ctx[0].answerCbQuery('📕 Тетрадь смерти', { cache_time: 3 })
   	break
   default: 
   	console.log('This component book doesn"t not exist.')
  }
	} catch (e) {
		console.error(e)
	}
}

// Троттлинг
let throttleBook = throttle(book, 1500)

// Actions
bot.action(new RegExp('books_(.+)'), ctx => throttleBook([ctx, 'главная']))
bot.action(new RegExp('book_first_(.+)'), ctx => throttleBook([ctx, '1']))
bot.action(new RegExp('book_second_(.+)'), ctx => throttleBook([ctx, '2']))
bot.action(new RegExp('book_third_(.+)'), ctx => throttleBook([ctx, '3']))

module.exports = bot

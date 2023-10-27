const { Composer, Markup, Extra } = require('telegraf')
const User = require('../../models/user.model.js')
const BlackMarket = require('../../models/black_market.model.js')
const bot = new Composer()
const throttle = require('../../utils/throttle.js')

// 'Черный рынок'
const blackMarket = async (ctx) => {
	try {
		const uuid = String(ctx[0].from.id) // ID user
		const data = ctx[0].match[0] // Information btn
		if (data.indexOf(uuid) === -1) return // Проверка чужокого нажатия на кнопку

		switch (ctx[1]) {
		 case 'главная':
		  // Проверка на рабочий день
				if (new Date().getDay() === 6) {
					await BlackMarket.find().then(async goods => {
						const good_1 = await goods[0].count
						await ctx[0].editMessageText(
							ctx[0].i18n.t('black_marketplace'),
							Extra.markup(
								Markup.inlineKeyboard([
									[
										Markup.callbackButton(
											`🧩 Сайтама(SSS) ${good_1} шт. ➻ 15 🧊 | 450 ₽`,
											`buy_char_saitama_${uuid}`
										),
									],
									[
										Markup.callbackButton('💰 Пополнить', `market_donat_${uuid}`),
										Markup.callbackButton('⬅️ Назад', `shop_${uuid}`),
									],
								])
							).HTML()
						)
					})
				} 
				else {
					await ctx[0].reply('🏦 Чёрный рынок открыт только по пятницам.')
				}

				ctx[0].answerCbQuery('🏦 Чёрный рынок', { cache_time: 3 })
		 	break
		 case 'сайтама':
				await BlackMarket.findOne({ uuid: 1 }).then(async good => {
					if (good.count === 0) {
						await ctx[0].reply(
							'👨‍🎤 Покупатель, этот товар уже разобрали, выбери что-нибудь другое!'
						)
						ctx[0].answerCbQuery('✅ Отмена', { cache_time: 3 })
						return
					}
					await User.findOne({ uuid }).then(async user => {
						if (!user.characters.includes(3) && user.resources.crio >= good.price) {
							await User.updateOne(
								{ uuid },
								{
									$push: { characters: 3 },
									$inc: { 'stats.bm': 28500, 'stats.hp': 128500 },
								}
							).then(async () => {
								await BlackMarket.updateOne(
									{ uuid: 1 },
									{ $inc: { count: -1 } }
								).then(async () => {
									await ctx[0].reply(
										'👨‍🎤 Поздравляю, ты приобрел 🧩 Сайтаму, возвращайся снова к нам за покупкой!'
									)
									ctx[0].answerCbQuery('✅ Успешно', { cache_time: 3 })
								})
							})
						} else {
							await ctx[0].reply(
								'👨‍🎤 Покупаеть, у тебя уже есть 🧩 Сайтама или же не хватает крионитов 🧊, возвращайся снова к нам за покупкой!'
							)
							ctx[0].answerCbQuery('✅ Отмена', { cache_time: 3 })
						}
					})
				})
		 	break
		 default:
		 	console.log('This component or product doesn"t not exist.')
		}

	} catch (e) {
		console.error(e)
	}
}

// Троттлинг
let throttleBlackMarket = throttle(blackMarket, 1500)

// Actions
bot.action(new RegExp('black_marketplace_(.+)'), ctx => throttleBlackMarket([ctx, 'главная']))
bot.action(new RegExp('buy_char_saitama_(.+)'), ctx => throttleBlackMarket([ctx, 'сайтама']))

module.exports = bot

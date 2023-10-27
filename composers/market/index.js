const { Composer, Markup, Extra } = require('telegraf')
const bot = new Composer()
const User = require('../../models/user.model.js')
const Market = require('../../models/market.model.js')
const throttle = require('../../utils/throttle.js')

// '〽️ Биржа'
const market = async (ctx) => {
	try {
		const uuid = String(ctx[0].from.id) // ID user
		let sum = 0

	 switch (ctx[1]) {
	  case 'главная':
				let data = ctx[0].match[0]
				if (data.indexOf(uuid) === -1) return

		  // Проверка на рабочий день
				let day = new Date().getDay()
				if (day === 6 || day === 0) {
					await ctx[0].reply('〽️ Биржа работает в ПН-ПТ.')
					return
				}

				let list = ''

				await Market.find({}).then(async goods => {
					for (let i = 0; i < goods.length; i++) {
						list += `<u>${i + 1}.</u> ${goods[i].name} ➻ ${goods[i].price} 🧊 / ${
							goods[i].price
						} ₽ | ${goods[i].player.name}\n`
					}

					await ctx[0].editMessageText(
						ctx[0].i18n.t('market', { list }),
						Extra.markup(
							Markup.inlineKeyboard([
								[
									Markup.callbackButton('⬅️ Назад', `shop_${uuid}`),
									Markup.callbackButton('💰 Пополнить', `m_donat_${uuid}`),
								],
							])
						).HTML()
					)
				})
				ctx[0].answerCbQuery('〽️ Биржа', { cache_time: 3 })
	  	break
	  case '1':
			 sum = Number(ctx[0].message.text.toLowerCase().split('за')[1].trim())
				await Market.findOne({ uuid: 1 }).then(async good => {
					await User.findOne({ uuid }).then(async user => {
						if (user.characters.includes(3)) {
							await ctx[0].reply('👨‍⚖️ Не сможешь его выкупить, когда ты уже имеешь такого персонажа как 🧩 Сайтама')
							return
						}
						if (sum > good.price && user.resources.crio > sum) {
							await User.updateOne({ uuid }, { $inc: { 'resources.crio': -sum } })
							await Market.updateOne(
								{ uuid: 1 },
								{
									$set: {
										price: sum,
										'player.name': user.name,
										'player.uuid': uuid,
									},
								}
							).then(async () => {
								await ctx[0].reply(
									`👨‍⚖️ Поздравляю, ты выкупил 🧩 Сайтама за ${sum} 🧊, осталось надеется, что его никто не выкупит после тебя!`
								)
							})
						}
					})
				})
	  	break
	  case '2':
	  	sum = Number(ctx[0].message.text.toLowerCase().split('за')[1].trim())
				await Market.findOne({ uuid: 2 }).then(async good => {
					await User.findOne({ uuid }).then(async user => {
						if (user.resources.amulets.first) {
							await ctx[0].reply('👨‍⚖️ Не сможешь его выкупить, когда ты уже имеешь такого амулет как 🪬 Сученок!')
							return
						}
						if (sum > good.price && user.resources.crio > sum) {
							await User.updateOne({ uuid }, { $inc: { 'resources.crio': -sum } })
							await Market.updateOne(
								{ uuid: 2 },
								{
									$set: {
										price: sum,
										'player.name': user.name,
										'player.uuid': uuid,
									},
								}
							).then(async () => {
								await ctx[0].reply(
									`👨‍⚖️ Поздравляю, ты выкупил 🪬 Сученок за ${sum} 🧊, осталось надеется, что его никто не выкупит после тебя!`
								)
							})
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
let throttleMarket = throttle(market, 1500)

// Messages
bot.hears(new RegExp('выкупить 1 за', 'i'), ctx => throttleMarket([ctx, '1']))
bot.hears(new RegExp('выкупить 2 за', 'i'), ctx => throttleMarket([ctx, '2']))

// Actions
bot.action(new RegExp('market_(.+)'), ctx => throttleMarket([ctx, 'главная']))

module.exports = bot

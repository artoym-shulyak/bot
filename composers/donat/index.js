const { Composer, Markup, Extra } = require('telegraf')
const bot = new Composer()
const User = require('../../models/user.model.js')
const throttle = require('../../utils/throttle.js')

// Донат
const donat = async (ctx) => {
	try {
		const uuid = ctx[0].from.id // ID user

		if (await User.findOne({uuid}) == null) return
	
		if (ctx[0].updateType === 'callback_query') {
			let data = ctx[0].match[0]
			if (data.indexOf(uuid) === -1) return

		 await ctx[0].editMessageText(ctx[0].i18n.t('donat'), {
				disable_web_page_preview: true,
				...Extra.markup(
						Markup.inlineKeyboard([
							[Markup.urlButton('💭 Отправить чек',	 'https://t.me/ArtoymShulyak')],
							[Markup.callbackButton(ctx[2], `${ctx[1]}_${uuid}`),],
						])
					).HTML()
				}
			)
			ctx[0].answerCbQuery('💰 Способы пополнения', {cache_time: 3})
			return
		} 

		if (ctx[0].updateType === 'message') {
		 await ctx[0].reply(ctx[0].i18n.t('donat'), {
				disable_web_page_preview: true,
				...Extra.markup(
						Markup.inlineKeyboard([
							[Markup.urlButton('💭 Отправить чек',	 'https://t.me/ArtoymShulyak')],
						])
					).HTML()
				}
			)
		}


	} catch (e) {
		console.error(e)
	}
}

// Троттлинг
let throttleDonat = throttle(donat, 1500)

// Mesages
bot.hears(new RegExp('донат', 'i'), ctx => throttleDonat([ctx]))

// Actions
bot.action(new RegExp('a_donat_(.+)'), ctx => throttleDonat([ctx, 'amulets', 'Вернуться к амулетам 🔮']))
bot.action(new RegExp('b_donat_(.+)'), ctx => throttleDonat([ctx, 'books', 'Вернуться к книгам 📚']))
bot.action(new RegExp('c_donat_(.+)'), ctx => throttleDonat([ctx, 'cards', 'Вернуться к картам 🃏']))
bot.action(new RegExp('v_donat_(.+)'), ctx => throttleDonat([ctx, 'vip', 'Вернуться к ⭐️ VIP']))
bot.action(new RegExp('market_donat_(.+)'), ctx => throttleDonat([ctx, 'black_marketplace', 'Вернуться к 🏦 Черному рынку']))
bot.action(new RegExp('cl_donat_(.+)'), ctx => throttleDonat([ctx, 'clMoney', 'Вернуться к 🪙 Монеты гильдии']))
bot.action(new RegExp('m_donat_(.+)'), ctx => throttleDonat([ctx, 'market', 'Вернуться к 〽️ Бирже']))

module.exports = bot

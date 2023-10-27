const { Composer, Markup, Extra } = require('telegraf')
const bot = new Composer()
const User = require('../../models/user.model.js')
const Rating = require('../../models/rating.model.js')
const throttle = require('../../utils/throttle.js')

// ⚙️ Настройки
const settings = async (ctx) => {
	try {
		const uuid = ctx[0].from.id // ID user
  let data
  let action = 'reply'

	if (ctx[0].updateType === 'callback_query') {
		data = ctx[0].match[1]
		if (data.indexOf(uuid) === -1) return
		action = 'editMessageText'
	 ctx[0].answerCbQuery('⚙️', { cache_time: 3 })
	} 

	if (await User.findOne({uuid}) == null) return

  switch (ctx[1]) {
   case 'главная':
				await ctx[0][action](
						ctx[0].i18n.t('settings'),
						Extra.markup(
							Markup.inlineKeyboard([
								[Markup.callbackButton('🪪 Сменить ник', `change_name_${uuid}`)],
								[
									Markup.callbackButton(
										'🔏 Видимость информации',
										`visibility_info_${uuid}`
									),
								],
								[Markup.callbackButton('⛓ Рефералка', `referral_${uuid}`)],
								[
									Markup.callbackButton('⬅️ Назад', `studia_${uuid}`),
									Markup.urlButton(
									'📝 Команды',
									'https://telegra.ph/Komandy-10-18-2'
								)
									],
							])
						).HTML()
					)
   	break
   case 'видимость информации':
				await ctx[0].editMessageText(
					ctx[0].i18n.t('visibility_info'),
					Extra.markup(
						Markup.inlineKeyboard([
							[Markup.callbackButton('⬅️ Назад', `settings_${uuid}`)],
						])
					).HTML()
				)
   	break
   case 'сменить ник':
				await ctx[0].editMessageText(
					ctx[0].i18n.t('change_name'),
					Extra.markup(
						Markup.inlineKeyboard([
							Markup.callbackButton('⬅️ Назад', `settings__${uuid}`),
						])
					).HTML()
				)
   	break
   case 'изменение ника':
				const name = ctx[0].message.text.toLowerCase() // TEXT user

				if (name.indexOf('сменить ник') != -1) {
					let stateName = ctx[0].message.text.replace(/сменить ник/i, '').trim() // New name of user

					// Проверка на кол-во символов в нике
					if (stateName.length < 2 || stateName.length > 20) {
						await ctx[0].replyWithHTML(
							'⚒ Ник должен содержать: <i>мин. 2 - макс 20 символов</i>.'
						)
						return
					}

					// Проверка на одинаковое имя
					await User.find().then(async users => {
						users.forEach(player => {
							if (player.name == stateName) {
								ctx[0].reply('🧑‍💻 Это имя уже занято.')
								throw new Error('Это имя уже занято')
							}
						})
					})

					await User.findOne({ uuid }).then(async user => {
						// Если уже менял, далее платное изменение
						if (user.settings.countName > 0) {
							// Проверка на стоимость ника (Цена: 5 крионитов 🧊)
							if (user.resources.crio > 5) {
								// Изменение имени игрока
								await Rating.updateOne({ uuid }, { $set: { name: stateName } })
								await User.updateOne(
									{ uuid },
									{
										$set: { name: stateName },
										$inc: { 'settings.countName': 1, 'resources.crio': -5 },
									}
								).then(async () => {
									await ctx[0].reply(
										`🪪 Ваш ник успешно изменился на <strong>${stateName}</strong>.`,
										{ parse_mode: 'HTML' }
									)
								})
							} else {
								ctx[0].reply('🪪 Для смены ника нужно не менее 5 крионита 🧊')
							}
						} else {
							// Изменение имени игрока
							await Rating.updateOne({ uuid }, { $set: { name: stateName } })
							await User.updateOne(
								{ uuid },
								{ $set: { name: stateName }, $inc: { 'settings.countName': 1 } }
							).then(async () => {
								await ctx[0].reply(
									`🪪 Ваш ник успешно изменился на <strong>${stateName}</strong>.`,
									{ parse_mode: 'HTML' }
								)
							})
						}
					})
				}
   	break
   case 'вип':
				const textVip = ctx[0].match[0].toLowerCase() // Information btn
				if (textVip === 'показать вип') {
					await User.updateOne(
						{ uuid },
						{ $set: { 'settings.visibility.vipCard': false } }
					).then(async () => {
						await ctx[0].replyWithHTML(
							'✅ Сведение о <code>⭐️ VIP-карта</code> ➠ <strong><i>показано</i></strong>.'
						)
					})
				} else if (textVip === 'скрыть вип') {
					await User.updateOne(
						{ uuid },
						{ $set: { 'settings.visibility.vipCard': true } }
					).then(async () => {
						await ctx[0].replyWithHTML(
							'✅ Сведение о <code>⭐️ VIP-карта</code> ➠ <strong><i>скрыта</i></strong>.'
						)
					})
				}
   	break
   case 'крионит':
				const textCrio = ctx[0].match[0].toLowerCase() // Information btn

				if (textCrio === 'показать крионит') {
					await User.updateOne(
						{ uuid },
						{ $set: { 'settings.visibility.crio': false } }
					).then(async () => {
						await ctx[0].replyWithHTML(
							'✅ Сведение о <code>🧊 Крионит</code> ➠ <strong><i>показано</i></strong>.'
						)
					})
				} else if (textCrio === 'скрыть крионит') {
					await User.updateOne(
						{ uuid },
						{ $set: { 'settings.visibility.crio': true } }
					).then(async () => {
						await ctx[0].replyWithHTML(
							'✅ Сведение о <code>🧊 Крионит</code> ➠ <strong><i>скрыта</i></strong>.'
						)
					})
				}
   	break
   case 'карты':
				const textRecrute = ctx[0].match[0].toLowerCase() // Information btn

				if (textRecrute === 'показать карты') {
					await User.updateOne(
						{ uuid },
						{ $set: { 'settings.visibility.card': false } }
					).then(async () => {
						await ctx[0].replyWithHTML(
							'✅ Сведение о <code>🃏 Найм</code> ➠ <strong><i>показано</i></strong>.'
						)
					})
				} else if (textRecrute === 'скрыть карты') {
					await User.updateOne(
						{ uuid },
						{ $set: { 'settings.visibility.card': true } }
					).then(async () => {
						await ctx[0].replyWithHTML(
							'✅ Сведение о <code>🃏 Найм</code> ➠ <strong><i>скрыта</i></strong>.'
						)
					})
				}
   	break
   default:
   	console.log('This point doesn"t not exist.')
  }

} catch (e) {
	console.error(e)
}
}

// Троттлинг ----->
let throttleSettings = throttle(settings, 1500)

// Messages
bot.hears(new RegExp('настройки', 'i'), ctx => throttleSettings([ctx, 'главная']))
bot.hears(/\сменить ник(.+)/i, ctx => throttleSettings([ctx, 'изменение ника']))
bot.hears([new RegExp('показать вип', 'i'), new RegExp('скрыть вип', 'i')], ctx => throttleSettings([ctx, 'вип']))
bot.hears([new RegExp('показать крионит', 'i'), new RegExp('скрыть крионит', 'i')], ctx => throttleSettings([ctx, 'крионит']))
bot.hears([new RegExp('показать карты', 'i'), new RegExp('скрыть карты', 'i')], ctx => throttleSettings([ctx, 'карты']))

// Actions ----->
bot.action(new RegExp('settings_(.+)'), ctx => throttleSettings([ctx, 'главная']))
bot.action(new RegExp('visibility_info_(.+)'), ctx => throttleSettings([ctx, 'видимость информации']))
bot.action(new RegExp('change_name_(.+)'), ctx => throttleSettings([ctx, 'сменить ник']))

module.exports = bot

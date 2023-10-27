const { Composer, Markup, Extra } = require('telegraf')
const bot = new Composer()
const User = require('../../models/user.model.js')
const Rating = require('../../models/rating.model.js')
const Clan = require('../../models/clan.model.js')
const throttle = require('../../utils/throttle.js')

// "👑 Рейтинг"
const rating = async (ctx) => {
	try {
		const uuid = ctx[0].from.id // ID user
		const data = ctx[0].match[0] // Information btn
		if (data.indexOf(uuid) === -1) return // Проверка чужокого нажатия на кнопку
		let listUsers = ''

  switch (ctx[1]) {
   case 'главная':
				await ctx[0].editMessageText(
					ctx[0].i18n.t('rating'),
					Extra.markup(
						Markup.inlineKeyboard([
							[Markup.callbackButton('🎯 Баттл', `rBPlayer_${uuid}`)],
							[Markup.callbackButton('💥 Боевая мощь', `rCombatPower_${uuid}`)],
							[Markup.callbackButton('🧩 Баттл', `rBChar_${uuid}`)],
							[Markup.callbackButton('🧩 PVP 3 vs 3', `rBTeamCharacters_${uuid}`)],
							[
								Markup.callbackButton(
									'🧩 Кол-во персонажей',
									`rCCharacters_${uuid}`
								),
							],
							[Markup.callbackButton('🏆 Гильдии', `rGClans_${uuid}`)],
							[Markup.callbackButton('⬅️ Назад', `studia_${uuid}`)],
						])
					).HTML()
				)
	   ctx[0].answerCbQuery('👑 Рейтинг', { cache_time: 3 })
   	break
   case '🎯 баттл':
				await Rating.find()
					.sort({ 'battle': -1 })
					.then(async users => {
						users.forEach((user, i) => {
							if (i < 10) {
								listUsers += `${i + 1}. ${user.name} ➠ ${user.battle}\n`
							}
							user.uuid == uuid ? (place = i + 1) : null
						})
					})
				await ctx[0].editMessageText(
					ctx[0].i18n.t('Р_Баттл_Победы', { listUsers, place }),
					Extra.markup(
						Markup.inlineKeyboard([
							Markup.callbackButton('⬅️ Назад', `rating_${uuid}`),
						])
					).HTML()
				)
				ctx[0].answerCbQuery('🎯 Баттл', { cache_time: 3 })
    break;
	  case 'боевая мощь':
	  	await User.findOne({uuid})
	  	.then(async user => {
	  		await Rating.updateOne({uuid}, {$set: {"combatPower": user.stats.bm}})
	  	})
				await Rating.find()
					.sort({ 'combatPower': -1 })
					.then(async users => {
						users.forEach((user, i) => {
							if (i < 10) {
								listUsers += `${i + 1}. ${user.name} ➠ ${user.combatPower}\n`
							}
							user.uuid == uuid ? (place = i + 1) : null
						})
					})
				await ctx[0].editMessageText(
					ctx[0].i18n.t('Р_Боевая_Мощь', { listUsers, place }),
					Extra.markup(
						Markup.inlineKeyboard([
							Markup.callbackButton('⬅️ Назад', `rating_${uuid}`),
						])
					).HTML()
				)
				ctx[0].answerCbQuery('💥 Боевая мощь', { cache_time: 3 })
   	break
   case '🧩 баттл':
				await Rating.find()
					.sort({ 'battleCharacter': -1 })
					.then(async users => {
						users.forEach((user, i) => {
							if (i < 10) {
								listUsers += `${i + 1}. ${user.name} ➠ ${user.battleCharacter}\n`
							}
							user.uuid == uuid ? (place = i + 1) : null
						})
					})
				await ctx[0].editMessageText(
					ctx[0].i18n.t('Р_Баттл_Персонаж', { listUsers, place }),
					Extra.markup(
						Markup.inlineKeyboard([
							Markup.callbackButton('⬅️ Назад', `rating_${uuid}`),
						])
					).HTML()
				)
				ctx[0].answerCbQuery('🧩 Баттл', { cache_time: 3 })
   	break
   case '🧩 пвп команда':
				await Rating.find()
					.sort({ 'teamCharacters': -1 })
					.then(async users => {
						users.forEach((user, i) => {
							if (i < 10) {
								listUsers += `${i + 1}. ${user.name} ➠ ${user.teamCharacters}\n`
							}
							user.uuid == uuid ? (place = i + 1) : null
						})
					})
				await ctx[0].editMessageText(
					ctx[0].i18n.t('Р_PVP_Команда', { listUsers, place }),
					Extra.markup(
						Markup.inlineKeyboard([
							Markup.callbackButton('⬅️ Назад', `rating_${uuid}`),
						])
					).HTML()
				)
				ctx[0].answerCbQuery('🧩 PVP Команда', { cache_time: 3 })
   	break
   case 'кол-во персонажей':
  	 await User.findOne({uuid})
  	 .then(async user => {
  	 	await Rating.updateOne({uuid}, {$set: {"countCharacters": user.characters.length}})
  	 })
				await Rating.find()
					.sort({ 'countCharacters': -1 })
					.then(async users => {
						users.forEach((user, i) => {
							if (i < 10) {
								listUsers += `${i + 1}. ${user.name} ➠ ${user.countCharacters}\n`
							}
							user.uuid == uuid ? (place = i + 1) : null
						})
					})
				await ctx[0].editMessageText(
					ctx[0].i18n.t('Р_Кол-во_персонажей', { listUsers, place }),
					Extra.markup(
						Markup.inlineKeyboard([
							Markup.callbackButton('⬅️ Назад', `rating_${uuid}`),
						])
					).HTML()
				)
				ctx[0].answerCbQuery('🧩 Кол-во персонажей', { cache_time: 3 })
   	break
   case 'известность гильдии':
  		await User.findOne({uuid})
  		.then(async user => {
					await Clan.find()
						.sort({ "glory": -1 })
						.then(async clans => {
							let listClans = ''
							let place = ''
							clans.forEach((clan, i) => {
								if (i < 10) {
									listUsers += `${i + 1}. ${clan.name} ➠ ${clan.glory}\n`
								}
								clan.name == user.clan.name ? (place = i + 1) : null
							})

						})
				await ctx[0].editMessageText(
					ctx[0].i18n.t('Р_Известность_Гильдии', { listUsers, place }),
					Extra.markup(
						Markup.inlineKeyboard([
							Markup.callbackButton('⬅️ Назад', `rating_${uuid}`),
						])
					).HTML()
				)
					ctx[0].answerCbQuery('🏆 Известнотсь Гильдии', { cache_time: 3 })
  		})
   	break
   case 'найм':
				await Rating.find()
					.sort({ 'recruteChar': -1 })
					.then(async users => {
						users.forEach((user, i) => {
							if (i < 10) {
								listUsers += `${i + 1}. ${user.name} ➠ ${user.recruteChar}\n`
							}
							user.uuid == uuid ? (place = i + 1) : null
						})
					})
				await ctx[0].editMessageText(
					ctx[0].i18n.t('И_Р_Найм', { listUsers, place }),
					Extra.markup(
						Markup.inlineKeyboard([
							Markup.callbackButton('⬅️ Назад', `events_${uuid}`),
						])
					).HTML()
				)
				ctx[0].answerCbQuery('🧩 Найм', { cache_time: 3 })
   	break
   default:
   	console.log('This category or component doesn"t not exist.')
  }
	} catch (e) {
		console.error(e)
	}
}

// Троттлинг ----->
let throttleRating = throttle(rating, 1200)

// Actions ----->
bot.action(new RegExp('rating_(.+)'), ctx => throttleRating([ctx, 'главная']))
bot.action(new RegExp('rBPlayer_(.+)'), ctx => throttleRating([ctx, '🎯 баттл']))
bot.action(new RegExp('rCombatPower_(.+)'), ctx => throttleRating([ctx, 'боевая мощь']))
bot.action(new RegExp('rBChar_(.+)'), ctx => throttleRating([ctx, '🧩 баттл']))
bot.action(new RegExp('rBTeamCharacters_(.+)'), ctx => throttleRating([ctx, '🧩 пвп команда']))
bot.action(new RegExp('rCCharacters_(.+)'), ctx => throttleRating([ctx, 'кол-во персонажей']))
bot.action(new RegExp('rGClans_(.+)'), ctx => throttleRating([ctx, 'известность гильдии']))
bot.action(new RegExp('eRCRating_(.+)'), ctx => throttleRating([ctx, 'найм']))

module.exports = bot

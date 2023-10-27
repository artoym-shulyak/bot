// const { Markup, Extra } = require('telegraf')
// const Rating = require('../models/rating.model.js')
// const User = require('../models/user.model.js')
// const Clan = require('../models/clan.model.js')

// const rating = async (ctx, point, text, uuid, home) => {
// 	try {
	

// 		await Rating.find()
// 			.sort({ per: -1 })
// 			.then(async users => {
// 				let listUsers = ''
// 				let place = ''
// 				users.forEach((user, i) => {
// 					if (i < 10) {
// 						listUsers += `${i + 1}. ${user.name} ➠ ${user[point]}\n`
// 					}
// 					user.uuid == uuid ? (place = i + 1) : null
// 				})

// 				// await User.updateOne({uuid}, {$set: {"placeEvents.recruteChar": place}})

// 				await ctx.editMessageText(
// 					ctx.i18n.t(text, { listUsers, place }),
// 					Extra.markup(
// 						Markup.inlineKeyboard([
// 							Markup.callbackButton('⬅️ Назад', `${home}_${uuid}`),
// 						])
// 					).HTML()
// 				)
// 			})
// 	} catch (e) {
// 		console.error(e)
// 	}
// }

// const ratingGloryClans = async (ctx, point, text, user, home) => {
// 	try {
// 		await Clan.find()
// 			.sort({ "point": -1 })
// 			.then(async clans => {
// 				let listClans = ''
// 				let place = ''
// 				clans.forEach((clan, i) => {
// 					if (i < 10) {
// 						listClans += `${i + 1}. ${clan.name} ➠ ${clan[point]}\n`
// 					}
// 					clan.name == user.clan.name ? (place = i + 1) : null
// 				})

// 				await ctx.editMessageText(
// 					ctx.i18n.t(text, { listClans, place }),
// 					Extra.markup(
// 						Markup.inlineKeyboard([
// 							Markup.callbackButton('⬅️ Назад', `${home}_${user.uuid}`),
// 						])
// 					).HTML()
// 				)
// 			})
// 	} catch (e) {
// 		console.error(e)
// 	}
// }

// // Определения места разные ‼️‼️‼️

// module.exports = {
// 	rating,
// 	ratingGloryClans,
// }

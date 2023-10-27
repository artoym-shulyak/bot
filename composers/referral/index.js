const { Composer, Markup, Extra } = require('telegraf')
const bot = new Composer()
const User = require('../../models/user.model.js')
const throttle = require('../../utils/throttle.js')
const sleep = require('../../utils/sleep.js')

// '⛓ Рефералка'
const referral = async (ctx) => {
	try {
		const uuid = String(ctx[0].from.id) // ID user
		const data = ctx[0].match[0] // Information btn
		if (data.indexOf(uuid) === -1) return // Проверка чужокого нажатия на кнопку

		switch (ctx[1]) {
		 case 'главная':
				await User.findOne({ uuid }).then(async user => {
					if (
						(await user.referral.todayCompleted) === user.referral.count ||
						user.referral.todayCompleted >= user.referral.count
					) {
						await User.updateOne({ uuid },{$set: {'referral.completed': true,'referral.todayCompleted': user.referral.todayCompleted,},
							}
						)
					}

					await ctx[0].editMessageText(
						ctx[0].i18n.t('referral', {
							uuid,
							countReferrals: await user.referral.countReferrals,
						}),
						Extra.markup(
							Markup.inlineKeyboard([
								[Markup.callbackButton('Реферальное задание', `rf_task_${uuid}`)],
								[
									Markup.callbackButton('⬅️ Назад', `settings_${uuid}`),
								],
							])
						).HTML()
					)
				})

				ctx[0].answerCbQuery('⛓ Рефералка', { cache_time: 3 })
		 	break
		 case 'задание':
				await User.findOne({ uuid }).then(async user => {
					if (user.referral.stateReward) {
						await ctx[0].editMessageText(
							ctx[0].i18n.t(`referral_task`, {
								todayCompleted: await user.referral.todayCompleted, // Сегодняшний прогресс приглашенных рефералов
								count: await user.referral.count, // Для выполенения задачи нужно...
								reward: await user.referral.reward, // Награда
								completed: '✅', // Состояние задачи
								stateReward: (await user.referral.stateReward) ? '✅' : '❌', // Состояние, забрал ли игрок свою награду,
							}),
							Extra.markup(
								Markup.inlineKeyboard([
									Markup.callbackButton('⬅️ Назад', `referral_${uuid}`),
								])
							).HTML()
						)
						return
					}

					if (user.referral.completed) {
						await ctx[0].editMessageText(
							ctx[0].i18n.t(`referral_task`, {
								todayCompleted: await user.referral.todayCompleted, // Сегодняшний прогресс приглашенных рефералов
								count: await user.referral.count, // Для выполенения задачи нужно...
								reward: await user.referral.reward, // Награда
								completed: '✅', // Состояние задачи
								stateReward: (await user.referral.stateReward) ? '✅' : '❌', // Состояние, забрал ли игрок свою награду,
							}),
							Extra.markup(
								Markup.inlineKeyboard([
									Markup.callbackButton('⬅️ Назад', `referral_${uuid}`),
									Markup.callbackButton('🎁 Забрать', `rf_award_${uuid}`),
								])
							).HTML()
						)
					} else {
						await ctx[0].editMessageText(
							ctx[0].i18n.t(`referral_task`, {
								todayCompleted: await user.referral.todayCompleted, // Сегодняшний прогресс приглашенных рефералов
								count: await user.referral.count, // Для выполенения задачи нужно...
								reward: await user.referral.reward, // Награда
								completed: (await user.referral.completed) ? '✅' : '❌', // Состояние задачи
								stateReward: (await user.referral.stateReward) ? '✅' : '❌', // Состояние, забрал ли игрок свою награду,
							}),
							Extra.markup(
								Markup.inlineKeyboard([
									Markup.callbackButton('⬅️ Назад', `referral_${uuid}`),
								])
							).HTML()
						)
					}
				})
				ctx[0].answerCbQuery('Реферальное задание', { cache_time: 3 })
		 	break
		 case 'награда':
				ctx[0].deleteMessage()
				await User.findOne({uuid})
				.then(async user => {
					if (user.referral.stateReward) return
					if (user.referral.completed === true) {
						await User.updateOne({uuid}, { $set: { 'referral.stateReward': true }, $inc: { 'resources.recrute': user.referral.reward} })
						await sleep(1500)
						await ctx[0].reply('🎁 Ты забрал награду за ⛓ "Реферальное задание"')
					}
				})
		  break
		 default:
		 	console.log('This components doesn"t not exist or really error.')
		}

	} catch (e) {
		console.error(e)
	}
}

// ТРОТТЛИНГ
let throttleReferral = throttle(referral, 1500)

// Actions
bot.action(new RegExp('referral_(.+)'), ctx => throttleReferral([ctx, 'главная']))
bot.action(new RegExp('rf_task_(.+)'), ctx => throttleReferral([ctx, 'задание']))
bot.action(new RegExp('rf_award_(.+)'), ctx => throttleReferral([ctx, 'награда']))

module.exports = bot

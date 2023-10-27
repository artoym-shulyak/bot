const { Composer, Markup, Extra } = require('telegraf')
const bot = new Composer()
const User = require('../../models/user.model.js')
const throttle = require('../../utils/throttle.js')

// -> Other functions from files
bot.use(require('./playerSearch.js')) // Поиск игрока
bot.use(require('./changeInfo.js')) // Сменить что-то...

const battle = async (ctx) => {
	try {
		const uuid = ctx[0].from.id // ID user
		let action = 'reply'

		if (ctx[0].updateType === 'callback_query') {
			const data = ctx[0].match[1]
			if (data.indexOf(uuid) === -1) return
			action = "editMessageText"
		 ctx[0].answerCbQuery('⚔️ Сражение', { cache_time: 3 })
		} 

		if (await User.findOne({uuid}) === null) return

		switch (ctx[1]) {
		 case 'Главная':
				await ctx[0][action](
					ctx[0].i18n.t('battle'),
					Extra.markup(
						Markup.inlineKeyboard([
							[Markup.callbackButton('🎯 Баттл', `fight_players_${uuid}`)],
							[Markup.callbackButton('🧩 Баттл', `fight_characters_${uuid}`)],
							[
								Markup.callbackButton(
									'🧩 PVP 3 vs 3',
									`fight_team_chars_${uuid}`
								),
							],
							[
								Markup.callbackButton('⬅️ Назад', `studia_${uuid}`),
								Markup.urlButton(
									'📝 Справка',
									'https://telegra.ph/Telegram-YUot-10-16'
								),
							],
						])
					).HTML()
				)
		 	break
		 case '🎯 баттл':
				await User.findOne({ uuid }).then(async user => {
					await ctx[0].editMessageText(
						ctx[0].i18n.t('🎯 Баттл', { user }),
						Extra.markup(
							Markup.inlineKeyboard([
								[
									Markup.callbackButton(
										'🔎 Поиск и атаковать...',
										`fp_fight_${uuid}`
									),
								],
								[Markup.callbackButton('⬅️ Назад', `battle_${uuid}`)],
							])
						).HTML()
					)
				})
		 	break
		 case '🧩 баттл':
				await User.findOne({ uuid }).then(async user => {
							await ctx[0].editMessageText(
								ctx[0].i18n.t('🧩 Баттл', { char: await user.battle.char }),
								Extra.markup(
									Markup.inlineKeyboard([
										[
											Markup.callbackButton(
												'🔎 Поиск и атаковать',
												`fp_char_fight_${uuid}`
											),
										],
										[
											Markup.callbackButton(
												'🧩 Сменить персонажа',
												`change_character_${uuid}`
											),
										],
										[Markup.callbackButton('⬅️ Назад', `battle_${uuid}`)],
									])
								).HTML()
							)
						})
		 	break
		 case '🧩 pvp команда':
				await User.findOne({ uuid }).then(async user => {
						await ctx[0].editMessageText(
							ctx[0].i18n.t('🧩 PVP Команда', {
								char_1: await user.battle.teamCharacters.first,
								char_2: await user.battle.teamCharacters.second,
								char_3: await user.battle.teamCharacters.third,
							}),
							Extra.markup(
								Markup.inlineKeyboard([
									[Markup.callbackButton('🔎 Поиск и атаковать', `fс_team_${uuid}`)],
									[
										Markup.callbackButton(
											'🧩 Сменить персонажей',
											`change_team_character_${uuid}`
										),
									],
									[Markup.callbackButton('⬅️ Назад', `battle_${uuid}`)],
								])
							).HTML()
						)
					})
		 	break
		 default: 
		 	console.log('This so component. (fn:battle)')
		}
	} catch (e) {
		console.error(e)
	}
}

// Троттлинг ----->
let throttleBattle = throttle(battle, 1500)

// Messages
bot.hears(['сражение', 'Сражение', '⚔️ Сражение'], ctx => throttleBattle([ctx, 'Главная']))

// Actions
bot.action(new RegExp('battle_(.+)'), ctx => throttleBattle([ctx, 'Главная']))
bot.action(new RegExp('fight_players_(.+)'), ctx => throttleBattle([ctx, '🎯 баттл']))
bot.action(new RegExp('fight_characters_(.+)'), ctx => throttleBattle([ctx, '🧩 баттл']))
bot.action(new RegExp('fight_team_chars_(.+)'), ctx => throttleBattle([ctx, '🧩 pvp команда']))

module.exports = bot

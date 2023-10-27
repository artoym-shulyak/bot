const { Composer, Markup, Extra } = require('telegraf')
const bot = new Composer()
const User = require('../../models/user.model.js')
const Characters = require('../../models/characters.model.js')
const throttle = require('../../utils/throttle.js')

// Components ----->
// 'Сменить персонажа, персонажей и т.д' 
const changeBattle = async (ctx) => {
	try {
		const uuid = ctx[0].from.id // ID user
		let action = 'reply'
  let nameChar
  let newChar
  let character

		if (ctx[0].updateType === 'callback_query') {
			const data = ctx[0].match[1]
			if (data.indexOf(uuid) === -1) return
			action = "editMessageText"
		 ctx[0].answerCbQuery('⚔️ Сражение', { cache_time: 3 })
		} 

	if (await User.findOne({uuid}) == null) return
	
		switch (ctx[1]) {
		  case 'сменить персонажа 🧩 баттл':
						await ctx[0][action](
							ctx[0].i18n.t('🧩 Сменить персонажа(Баттл)'),
							Extra.markup(
								Markup.inlineKeyboard([
									Markup.callbackButton('⬅️ Назад', `fight_characters_${uuid}`),
								])
							).HTML()
						)
		    break;
		  case '🧩 сменить персонажей пвп команда':
						await ctx[0][action](
							ctx[0].i18n.t('🧩 Сменить персонажей(Баттл)'),
							Extra.markup(
								Markup.inlineKeyboard([
									Markup.callbackButton('⬅️ Назад', `fight_team_chars_${uuid}`),
								])
							).HTML()
						)
		    break;
		  case 'меняем персонажа 🧩 баттл':
					nameChar = ctx[0].message.text
						.toLowerCase()
						.replace(/сменить персонажа на/i, '')
						.trim()

					await User.findOne({ uuid }).then(async user => {

						if (await Characters.findOne({search: nameChar})) {
							character = await Characters.findOne({search: nameChar})
							if (user.characters.includes(character.uuid)) {
								if (character.search === nameChar) {
									newChar = await character

									await User.updateOne({ uuid }, { $set: { 'battle.char': newChar } }).then(
										async () => {
											await ctx[0].replyWithHTML(
												`✨ <code>${user.name}</code>, ты поменял персонажа на 🧩 ${newChar.name}.`,
											)
										}
									)
									return
								}
							}
						}
					})
		  	break
		  case 'ряд 1(пвп команда)':
					nameChar = ctx[0].message.text.toLowerCase().replace(/ряд 1/i, '').trim()


					await User.findOne({ uuid }).then(async user => {
						if (await Characters.findOne({search: nameChar})) {
							character = await Characters.findOne({search: nameChar})
							if (user.characters.includes(character.uuid)) {
								if (character.search === nameChar) {
									newChar = await character

									if (
										(await user.battle.teamCharacters.first.uuid) === newChar.uuid ||
										(await user.battle.teamCharacters.second.uuid) === newChar.uuid ||
										(await user.battle.teamCharacters.third.uuid) === newChar.uuid
									) {
										ctx[0].replyWithHTML(
											`🛗 Этот персонаж 🧩 ${newChar.name} уже состоит в команде.`
										)
										return
									}

									await User.updateOne(
										{ uuid },
										{ $set: { 'battle.teamCharacters.first': newChar } }
									).then(async () => {
										await ctx[0].replyWithHTML(
											`✨ <code>${user.name}</code>, ты поменял персонажа на 🧩 ${newChar.name}.`
										)
									})
								}
							}
						}
					})
		  	break
		  case 'ряд 2(пвп команда)':
					nameChar = ctx[0].message.text.toLowerCase().replace(/ряд 2/i, '').trim()

					await User.findOne({ uuid }).then(async user => {
						if (await Characters.findOne({search: nameChar})) {
							character = await Characters.findOne({search: nameChar})
							if (user.characters.includes(character.uuid)) {
								if (character.search === nameChar) {
									newChar = await character

									if (
										(await user.battle.teamCharacters.first.uuid) === newChar.uuid ||
										(await user.battle.teamCharacters.second.uuid) === newChar.uuid ||
										(await user.battle.teamCharacters.third.uuid) === newChar.uuid
									) {
										ctx[0].replyWithHTML(
											`🛗 Этот персонаж 🧩 ${newChar.name} уже состоит в команде.`
										)
										return
									}

									await User.updateOne(
										{ uuid },
										{ $set: { 'battle.teamCharacters.second': newChar } }
									).then(async () => {
										await ctx[0].replyWithHTML(
											`✨ <code>${user.name}</code>, ты поменял персонажа на 🧩 ${newChar.name}.`
										)
									})
								}
							}
						}
					})
		  	break
		  case 'ряд 3(пвп команда)':
					nameChar = ctx[0].message.text.toLowerCase().replace(/ряд 3/i, '').trim()

					await User.findOne({ uuid }).then(async user => {
						if (await Characters.findOne({search: nameChar})) {
							character = await Characters.findOne({search: nameChar})
							if (user.characters.includes(character.uuid)) {
								if (character.search === nameChar) {
									newChar = await character

									if (
										(await user.battle.teamCharacters.first.uuid) === newChar.uuid ||
										(await user.battle.teamCharacters.second.uuid) === newChar.uuid ||
										(await user.battle.teamCharacters.third.uuid) === newChar.uuid
									) {
										ctx[0].replyWithHTML(
											`🛗 Этот персонаж 🧩 ${newChar.name} уже состоит в команде.`
										)
										return
									}

									await User.updateOne(
										{ uuid },
										{ $set: { 'battle.teamCharacters.third': newChar } }
									).then(async () => {
										await ctx[0].replyWithHTML(
											`✨ <code>${user.name}</code>, ты поменял персонажа на 🧩 ${newChar.name}.`
										)
									})
								}
							}
						}
					})
		  	break
		  default:
		    console.log("Don't this command change character.")
		}
	} catch (e) {
		console.error(e)
	}
}

// Троттлинг
let throttleСhangeBattle = throttle(changeBattle, 1500)

// Meseges 
bot.hears(/\сменить персонажа на(.+)/i, ctx => throttleСhangeBattle([ctx, 'меняем персонажа 🧩 баттл']))
bot.hears(/\ряд 1(.+)/i, ctx => throttleСhangeBattle([ctx, 'ряд 1(пвп команда)']))
bot.hears(/\ряд 2(.+)/i, ctx => throttleСhangeBattle([ctx, 'ряд 2(пвп команда)']))
bot.hears(/\ряд 3(.+)/i, ctx => throttleСhangeBattle([ctx, 'ряд 3(пвп команда)']))

// Actions
bot.action(new RegExp('change_character_(.+)'), ctx => throttleСhangeBattle([ctx, 'сменить персонажа 🧩 баттл']))
bot.action(new RegExp('change_team_character_(.+)'), ctx => throttleСhangeBattle([ctx, '🧩 сменить персонажей пвп команда']))

module.exports = bot

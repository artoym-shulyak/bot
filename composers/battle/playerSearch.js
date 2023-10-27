const { Composer } = require('telegraf')
const bot = new Composer()
const User = require('../../models/user.model.js')
const {
	battlePlayer,
	battleCharacter,
	battlePlayerInfo,
	battleTeamCharacters,
} = require('./battle.js')
const { _getRandomInt } = require('../../utils/random.js')
const throttle = require('../../utils/throttle.js')

const searchFight = async ctx => {
	try {
		const uuid = String(ctx[0].from.id) // ID user
		let data

		switch (ctx[1]) {
			case '🎯 баттл':
				data = ctx[0].match[0] // Information btn
				if (data.indexOf(uuid) === -1) return // Проверка чужокого нажатия на кнопку
				await User.findOne({ uuid }).then(async user => {
					if (new Date() < user.deadlines.battle.deadline) {
						console.log(new Date().toLocaleString('ru-RU'))
						await ctx[0].replyWithHTML(
							`🎯 После предыдыдущего боя сможешь атаковать в <strong>${user.deadlines.battle.deadline
								.toLocaleString('ru-RU')
								.split(',')[1]
								.trim()}</strong> (МСК).`
						)
						ctx[0].answerCbQuery('🗡 Время еще не вышло...', { cache_time: 3 })
					} else {
						let players = []

						await User.findOne({ uuid }).then(async user => {
							players.push(user)
						})

						await User.findOne({ uuid: { $nin: uuid } }).then(async user => {
							players.push(user)
						})

						await battlePlayer(players, ctx[0], '', 1, '', uuid)
						await User.updateOne(
							{ uuid },
							{
								$set: {
									'deadlines.battle.deadline': new Date(
										Date.parse(new Date()) +
										    8 *
												60 *
												60 *
												1000
									),
								},
							}
						)
						ctx[0].answerCbQuery('🗡 Идет сражение', { cache_time: 3 })
					}
				})
				break
			case '🧩 баттл':
				data = ctx[0].match[0] // Information btn
				if (data.indexOf(uuid) === -1) return // Проверка чужокого нажатия на кнопку
				await User.findOne({ uuid }).then(async user => {
					if (new Date() < user.deadlines.battleChar.deadline) {
						console.log(new Date().toLocaleString('ru-RU'))
						await ctx[0].replyWithHTML(
							`🧩 После предыдыдущего боя сможешь атаковать в <strong>${user.deadlines.battleChar.deadline
								.toLocaleString('ru-RU')
								.split(',')[1]
								.trim()}</strong> (МСК).`
						)
						ctx[0].answerCbQuery('🗡 Время еще не вышло...', { cache_time: 3 })
					} else {
						let characters = []

						await User.findOne({ uuid }).then(async user => {
							user.battle.char.player = user.name
							user.battle.char.uuid = user.uuid
							user.battle.char.clan = await user.clan.name
							await characters.push(user.battle.char)
						})

						await User.findOne({ uuid: { $nin: uuid } }).then(async user => {
							user.battle.char.player = user.name
							user.battle.char.uuid = user.uuid
							user.battle.char.clan = await user.clan.name
							characters.push(user.battle.char)
						})

						await battleCharacter(characters, ctx[0], '', 1, uuid)
						await User.updateOne(
							{ uuid },
							{
								$set: {
									'deadlines.battleChar.deadline': await new Date(
										Date.parse(new Date()) +
											  8 *
												60 *
												60 *
												1000
									),
								},
							}
						)
						ctx[0].answerCbQuery('🗡 Идет сражение', { cache_time: 5 })
					}
				})
				break
			case '🧩 pvp команда':
				data = ctx[0].match[0] // Information btn
				if (data.indexOf(uuid) === -1) return // Проверка чужокого нажатия на кнопку
				await User.findOne({ uuid }).then(async user => {
					if (new Date() < user.deadlines.battleTeamCharacters.deadline) {
						console.log(new Date().toLocaleString('ru-RU'))
						await ctx[0].replyWithHTML(
							`🧩 После предыдыдущего боя сможешь атаковать в <strong>${user.deadlines.battleTeamCharacters.deadline
								.toLocaleString('ru-RU')
								.split(',')[1]
								.trim()}</strong> (МСК).`
						)
						ctx[0].answerCbQuery('🗡 Время еще не вышло...', { cache_time: 3 })
					} else {
						let characters = []

						await User.findOne({ uuid }).then(async user => {
							user.battle.teamCharacters.player = user.name
							user.battle.teamCharacters.uuid = user.uuid
							user.battle.teamCharacters.clan = await user.clan.name
							characters.push(user.battle.teamCharacters)
						})

						await User.findOne({ uuid: { $nin: uuid } }).then(async user => {
							user.battle.teamCharacters.player = user.name
							user.battle.teamCharacters.uuid = user.uuid
							user.battle.teamCharacters.clan = await user.clan.name
							characters.push(user.battle.teamCharacters)
						})

						await battleTeamCharacters(characters, ctx[0], '', 1, uuid, 1)
						await User.updateOne(
							{ uuid },
							{
								$set: {
									'deadlines.battleTeamCharacters.deadline': new Date(
										Date.parse(new Date()) +
											  8 *
												60 *
												60 *
												1000
									),
								},
							}
						)
						ctx[0].answerCbQuery('🗡 Идет сражение', { cache_time: 3 })
					}
				})
				break
			case 'инфо':
				const uuidPlayer = ctx[0].match[0].replace('info_attack_', '').trim() // Information btn
				if (uuid === uuidPlayer) return

				let players = []

				await User.findOne({ uuid }).then(user => {
					players.push(user)
				})

				await User.findOne({ uuid: uuidPlayer }).then(user => {
					players.push(user)
				})

				await battlePlayerInfo(players, ctx[0], '', 1, '', uuid)
				ctx[0].answerCbQuery('🗡 Идет сражение', { cache_time: 3 })
				break
			default:
				console.log("Don't this battle.")
		}
	} catch (e) {
		console.error(e)
	}
}

// Троттлинг ----->
let throtteSearchFight = throttle(searchFight, 1500)

// Actions
bot.action(new RegExp('fp_fight_(.+)'), ctx =>
	throtteSearchFight([ctx, '🎯 баттл'])
)
bot.action(new RegExp('fp_char_fight_(.+)'), ctx =>
	throtteSearchFight([ctx, '🧩 баттл'])
)
bot.action(new RegExp('fс_team_(.+)'), ctx =>
	throtteSearchFight([ctx, '🧩 pvp команда'])
)
bot.action(new RegExp('info_attack_(.+)'), ctx =>
	throtteSearchFight([ctx, 'инфо'])
)

module.exports = bot

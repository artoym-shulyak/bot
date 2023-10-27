const User = require('../../models/user.model.js')
const Rating = require('../../models/rating.model.js')
const Clan = require('../../models/clan.model.js')
const { _getRandomInt } = require('../../utils/random.js')

// "🎯 Баттл"
const battlePlayer = async (players, ctx, story = '', round, header, uuid) => {
	try {
		let player = await players.sort(() => Math.random() - 0.5)
		let attack
		let crete = ''
		let award

		// Информация о срежниях между игроками
		const header = `🪪 ${player[0].name} ⚔️k 🪪 ${player[1].name}\n💥 БМ: ${player[0].stats.bm} | ${player[1].stats.bm}\n➖➖➖`

		// Если True, то игрок промахивается, а иначе
		if (Math.floor(Math.random() * 2)) {
			story += `⚔️ Раунд <strong>${round++}</strong>\n🪪 <i><u>${
				player[0].name
			}</u> промахивается при ударе ➻  🪪 <u>${player[1].name}</u>: ${
				player[1].stats.hp <= 0 ? '💔 0' : `❤️ ${player[1].stats.hp}`
			}</i>\n➖\n`
		} else {
			// Если True, то игрок наносит критический урон, а иначе
			if (Math.floor(Math.random() * 2)) {
				attack = Math.ceil(
					(Math.random() * (1.5 - 1 + 1) + 1) * player[0].stats.bm
				)
				crete = 'критический урон'
			} else {
				attack = Math.ceil((player[0].stats.bm / 100) * _getRandomInt(50, 100)) //вычисление процентов
				crete = 'урона'
			}
			player[1].stats.hp = (await player[1].stats.hp) - attack
			story += `⚔️ Раунд <strong>${round++}</strong>\n🪪 <i><u>${
				player[0].name
			}</u> нанес ${crete} 💥 ${attack} ➻  🪪 <u>${player[1].name}</u>: ${
				player[1].stats.hp <= 0 ? '💔 0' : `❤️ ${player[1].stats.hp}`
			}</i>\n➖\n`
		}

		// // Если раундов более 30-50, то раненый в последнем раунду сбежал...
		if (round > _getRandomInt(30, 50)) {
			story += `♨️ В итоге 🪪 <u>${player[0].name}</u> <i>начинает со спины наносить удар, но при этом</i> <u>🪪 ${player[1].name}</u> <i>внезапно исчез.</i>\n`
			if (player[0].uuid == uuid) {
				await Clan.updateOne(
					{ "name": player[1].clan.name },
					{ $inc: { "glory": 1, "quest.todayCompleted": 1 } }
				)
				await Rating.updateOne({ uuid }, { $inc: { "battle": 1 } })
				await User.updateOne(
					{ uuid },
					{ $inc: { 'resources.crio': 1, 'quest.second.countCompleted': 1, "glory": 1 } }
				).then(async () => {
					await ctx.replyWithHTML(
						`${header}\n\n${story}\n👑 Побеждает 👑\n🪪 <strong>${player[1].name}</strong>.\n🪄 Награда: 1 🧊\n🏆 Слава: 1`
					)
				})
			} else {
				await ctx.replyWithHTML(
					`${header}\n\n${story}\n👑 Побеждает 👑\n🪪 <strong>${player[0].name}</strong>.`
				)
			}
		} else {
			;(await round) < 3 ? (award = 5) : (award = 2)
			if (player[0].stats.hp <= 0) {
				if (player[1].uuid == uuid) {
					await Clan.updateOne(
						{ "name": player[1].clan.name },
						{ $inc: { "glory": 1, "quest.todayCompleted": 1 } }
					)
					await Rating.updateOne({ uuid }, { $inc: { "battle": 1 } })
					await User.updateOne(
						{ uuid },
						{
							$inc: {
								'resources.crio': award,
								'quest.second.countCompleted': 1,
								"glory": 1
							},
						}
					).then(async () => {
						await ctx.replyWithHTML(
							`${header}\n\n${story}\n👑 Побеждает 👑\n🪪 <strong>${player[1].name}</strong>.\n🪄 Награда: ${award} 🧊\n🏆 Слава: 1`
						)
					})
				} else {
					await ctx.replyWithHTML(
						`${header}\n\n${story}\n👑 Побеждает 👑\n🪪 <strong>${player[1].name}</strong>.`
					)
				}
			} else if (player[1].stats.hp <= 0) {
				if (player[0].uuid == uuid) {
					await Clan.updateOne(
						{ "name": player[0].clan.name },
						{ $inc: { "glory": 1, "quest.todayCompleted": 1 } }
					)
					await Rating.updateOne({ uuid }, { $inc: { "battle": 1 } })
					await User.updateOne(
						{ uuid },
						{
							$inc: {
								'resources.crio': award,
								'quest.second.countCompleted': 1,
								"glory": 1
							},
						}
					).then(async () => {
						await ctx.replyWithHTML(
							`${header}\n\n${story}\n👑 Побеждает 👑\n🪪 <strong>${player[0].name}</strong>.\n🪄 Награда: ${award} 🧊\n🏆 Слава: 1`
						)
					})
				} else {
					await ctx.replyWithHTML(
						`${header}\n\n${story}\n👑 Побеждает 👑\n🪪 <strong>${player[0].name}</strong>.`
					)
				}
			} else {
				// Идут сражение до тех пор, пока кто-то не будет ранен...
				await battlePlayer(players, ctx, story, round, header, uuid)
			}
		}
	} catch (e) {
		console.error(e)
	}
}

// "🧩 Баттл"
const battleCharacter = async (characters, ctx, story = '', round, uuid) => {
	try {
		let _char = await characters.sort(() => Math.random() - 0.5)
		let award = 1
		let attack
		let crete = ''

		// Если True, то игрок промахивается, а иначе
		if (Math.floor(Math.random() * 2)) {
			story += `⚔️ Раунд <strong>${round++}</strong>\n🪪 ${
				_char[0].player
			} 🗡💫 🪪 ${_char[1].player}\n🧩 <i><u>${
				_char[0].name
			}</u> промахивается при ударе ➻  🧩 <u>${_char[1].name}</u>: ${
				_char[1].stats.hp <= 0 ? '💔 0' : `❤️ ${_char[1].stats.hp}`
			}</i>\n➖➖➖\n`
		} else {
			// Если True, то игрок наносит критический урон, а иначе
			if (Math.floor(Math.random() * 2)) {
				attack = Math.ceil(
					(Math.random() * (1.5 - 1 + 1) + 1) * _char[0].stats.bm
				)
				crete = 'критический урон'
			} else {
				attack = Math.ceil((_char[0].stats.bm / 100) * _getRandomInt(50, 100)) //вычисление процентов
				crete = 'урона'
			}
			_char[1].stats.hp = (await _char[1].stats.hp) - attack
			story += `⚔️ Раунд <strong>${round++}</strong>\n🪪 ${
				_char[0].player
			} 🗡💫 🪪 ${_char[1].player}\n🧩 <i><u>${
				_char[0].name
			}</u> нанес ${crete} 💥 ${attack} ➻  🧩 <u>${_char[1].name}</u>: ${
				_char[1].stats.hp <= 0 ? '💔 0' : `❤️ ${_char[1].stats.hp}`
			}</i>\n➖➖➖\n`
		}

		// // Если раундов более 30-50, то раненый в последнем раунду сбежал...
		if (round > _getRandomInt(30, 50)) {
			story += `♨️ В итоге 🪪 ${_char[0].player} 🗡💫 🪪 ${_char[1].player}\n🧩 <i><u>${_char[0].name}</u> <i>начинает со спины наносить удар, но при этом</i> 🧩 <u>${_char[1].name}</u> <i>внезапно исчез.</i>\n`
			if (_char[0].uuid == uuid) {
				await Clan.updateOne({ "name": _char[0].clan }, { $inc: { "glory": 1, "quest.todayCompleted": 1 } })
				await Rating.updateOne({ uuid }, { $inc: { "battleCharacter": 1 } })
				await User.updateOne(
					{ uuid },
					{ $inc: { 'resources.crio': 1, 'quest.third.countCompleted': 1, "glory": 1 } }
				).then(async () => {
					await ctx.replyWithHTML(
						`${story}\n👑 Побеждает 👑\n🧩 <strong>${_char[0].name}</strong> | 🪪 <strong>${_char[0].player}</strong>.\n🪄 Награда: 1 🧊\n🏆 Слава: 1`
					)
				})
			} else {
				await ctx.replyWithHTML(
					`${story}\n👑 Побеждает 👑\n🧩 <strong>${_char[0].name}</strong> | 🪪 <strong>${_char[0].player}</strong>.\n`
				)
			}
		} else {
			;(await round) < 3 ? (award = 5) : (award = 3)
			if (_char[1].stats.hp < 0) {
				if (_char[0].uuid == uuid) {
					await Clan.updateOne({ "name": _char[0].clan }, { $inc: { "glory": 1, "quest.todayCompleted": 1 } })
					await Rating.updateOne({ uuid }, { $inc: { "battleCharacter": 1 } })
					await User.updateOne(
						{ uuid },
						{
							$inc: {
								'resources.crio': award,
								'quest.third.countCompleted': 1,
								"glory": 1
							},
						}
					).then(async () => {
						await ctx.replyWithHTML(
							`${story}\n👑 Побеждает 👑\n🧩 <strong>${_char[0].name}</strong> | 🪪 <strong>${_char[0].player}</strong>.\n🪄 Награда: ${award} 🧊\n🏆 Слава: 1`
						)
					})
				} else {
					await ctx.replyWithHTML(
						`${story}\n👑 Побеждает 👑\n🧩 <strong>${_char[0].name}</strong> | 🪪 <strong>${_char[0].player}</strong>.`
					)
				}
			} else if (_char[0].stats.hp < 0) {
				if (_char[1].uuid == uuid) {
					await Clan.updateOne({ "name": _char[1].clan }, { $inc: { "glory": 1, "quest.todayCompleted": 1 } })
					await Rating.updateOne({ uuid }, { $inc: { "battleCharacter": 1 } })
					await User.updateOne(
						{ uuid },
						{
							$inc: {
								'resources.crio': award,
								'quest.third.countCompleted': 1,
								"glory": 1
							},
						}
					).then(async () => {
						await ctx.replyWithHTML(
							`${story}\n👑 Побеждает 👑\n🧩 <strong>${_char[1].name}</strong> | 🪪 <strong>${_char[1].player}</strong>\n🪄 Награда: ${award} 🧊\n🏆 Слава: 1`
						)
					})
				} else {
					await ctx.replyWithHTML(
						`${story}\n👑 Побеждает 👑\n🧩 <strong>${_char[1].name}</strong> | 🪪 <strong>${_char[1].player}</strong>.`
					)
				}
			} else {
				await battleCharacter(characters, ctx, story, round, uuid)
			}
		}
	} catch (e) {
		console.error(e)
	}
}

// "🎯 Баттл АФК"
const battlePlayerInfo = async (players, ctx, story = '', round, uuid) => {
	try {
		let player = await players.sort(() => Math.random() - 0.5)
		let attack
		let crete = ''

		// Информация о срежниях между игроками
		const header = `🪪 ${player[0].name} ⚔️ 🪪 ${player[1].name}\n💥 БМ: ${player[0].stats.bm} | ${player[1].stats.bm}\n➖➖➖`

		// Если True, то игрок промахивается, а иначе
		if (Math.floor(Math.random() * 2)) {
			story += `⚔️ Раунд <strong>${round++}</strong>\n🪪 <i><u>${
				player[0].name
			}</u> промахивается при ударе ➻  🪪 <u>${player[1].name}</u>: ${
				player[1].stats.hp <= 0 ? '💔 0' : `❤️ ${player[1].stats.hp}`
			}</i>\n➖\n`
		} else {
			// Если True, то игрок наносит критический урон, а иначе
			if (Math.floor(Math.random() * 2)) {
				attack = Math.ceil(
					(Math.random() * (1.5 - 1 + 1) + 1) * player[0].stats.bm
				)
				crete = 'критический урон'
			} else {
				attack = Math.ceil((player[0].stats.bm / 100) * _getRandomInt(50, 100))
				crete = 'урона'
			}
			player[1].stats.hp = (await player[1].stats.hp) - attack
			story += `⚔️ Раунд <strong>${round++}</strong>\n🪪 <i><u>${
				player[0].name
			}</u> нанес ${crete} 💥 ${attack} ➻  🪪 <u>${player[1].name}</u>: ${
				player[1].stats.hp <= 0 ? '💔 0' : `❤️ ${player[1].stats.hp}`
			}</i>\n➖\n`
		}

		// // Если раундов более 30-50, то раненый в последнем раунду сбежал...
		if (round > _getRandomInt(30, 50)) {
			story += `♨️ В итоге 🪪 <u>${player[0].name}</u> <i>начинает со спины наносить удар, но при этом</i> <u>🪪 ${player[1].name}</u> <i>внезапно исчез.</i>\n`
			await ctx.replyWithHTML(
				`${header}\n\n${story}\n👑 Побеждает 👑\n🪪 <strong>${player[0].name}</strong>.`
			)
		} else {
			// Если один из игроков ранен, то проигрывает
			if (player[0].stats.hp <= 0) {
				await ctx.replyWithHTML(
					`${header}\n\n${story}\n👑 Побеждает 👑\n🪪 <strong>${player[1].name}</strong>.`
				)
			} else if (player[1].stats.hp <= 0) {
				await ctx.replyWithHTML(
					`${header}\n\n${story}\n👑 Побеждает 👑\n🪪 <strong>${player[0].name}</strong>.`
				)
			} else {
				// Идут сражение до тех пор, пока кто-то не будет ранен...
				battlePlayerInfo(players, ctx, story, round, header, uuid)
			}
		}
	} catch (e) {
		console.error(e)
	}
}

// "🧩 PVP Команда"
const battleTeamCharacters = async (
	characters,
	ctx,
	story,
	round,
	uuid,
	battle
) => {
	try {
		let players = await characters.sort(() => Math.random() - 0.5)
		let char_1_1 = await players[0].first
		let char_2_1 = await players[0].second
		let char_3_1 = await players[0].third
		let char_1_2 = await players[1].first
		let char_2_2 = await players[1].second
		let char_3_2 = await players[1].third
		let attack

		attack = Math.ceil((char_1_1.stats.bm / 100) * _getRandomInt(50, 100))

		if (battle === 1) {
			char_1_2.stats.hp = (await char_1_2.stats.hp) - attack
			story += `⚔️ Сражение <strong>1 VS 1</strong> | Раунд ${round++}\n🪪 ${
				players[0].player
			} 🗡💫 🪪 ${players[1].player}\n🧩 <i><u>${
				char_1_1.name
			}</u> нанес 💥 ${attack} урон ➻  🧩 <u>${char_1_2.name}</u>: ${
				char_1_2.stats.hp <= 0 ? '💔 0' : `❤️ ${char_1_2.stats.hp}`
			}</i>\n➖\n`
		}

		if (battle === 2) {
			char_2_2.stats.hp = (await char_2_2.stats.hp) - attack
			story += `⚔️ Сражение <strong>2 VS 2</strong> | Раунд ${round++}\n🪪 ${
				players[0].player
			} 🗡💫 🪪 ${players[1].player}\n🧩 <i><u>${
				char_2_1.name
			}</u> нанес 💥 ${attack} урон ➻  🧩 <u>${char_2_2.name}</u>: ${
				char_2_2.stats.hp <= 0 ? '💔 0' : `❤️ ${char_2_2.stats.hp}`
			}</i>\n➖\n`
		}

		if (battle === 3) {
			char_3_2.stats.hp = (await char_3_2.stats.hp) - attack
			story += `⚔️ Сражение <strong>3 VS 3</strong> | Раунд ${round++}\n🪪 ${
				players[0].player
			} 🗡💫 🪪 ${players[1].player}\n🧩 <i><u>${
				char_3_1.name
			}</u> нанес 💥 ${attack} урон ➻  🧩 <u>${char_3_2.name}</u>: ${
				char_3_2.stats.hp <= 0 ? '💔 0' : `❤️ ${char_3_2.stats.hp}`
			}</i>\n➖\n`
		}

		// // Если раундов более 30-50, то раненый в последнем раунду сбежал...
		if (round > _getRandomInt(15, 30)) {
			story += `♨️ В итоге команда 🪪 <u>${players[1].player}</u> <i>очень сильно пострадала в этом раунде, при этом исчезают из поле боя.</i>\n`
			if (players[1].uuid == uuid) {
				await Clan.updateOne({ "name": players[1].clan }, { $inc: { "glory": 1, "quest.todayCompleted": 1 } })
				await Rating.updateOne({ uuid }, { $inc: { "teamCharacters": 1 } })
				await User.updateOne(
					{ uuid },
					{ $inc: { 'resources.crio': 3, 'quest.fourth.countCompleted': 1, "glory": 1 } }
				).then(async () => {
					await ctx.replyWithHTML(
						`${story}\n👑 Побеждает 👑\n🪪 <strong>${players[0].player}</strong>\n🪄 Награда: 3 🧊\n🏆 Слава: 1`
					)
				})
			} else {
				await ctx.replyWithHTML(
					`${story}\n👑 Побеждает 👑\n🪪 <strong>${players[1].player}</strong>`
				)
			}
		} else {
			if ((char_1_1.stats.hp <= 0 || char_1_2.stats.hp <= 0) && battle === 1) {
				battle = 2
				if (char_1_1.stats.hp <= 0) {
					players[0].count = 0
					players[1].count = 1
				} else {
					players[1].count = 0
					players[0].count = 1
				}
				await battleTeamCharacters(characters, ctx, story, 1, uuid, battle)
			} else if (
				(char_2_1.stats.hp <= 0 || char_2_2.stats.hp <= 0) &&
				battle === 2
			) {
				battle = 3
				if (char_2_1.stats.hp <= 0) {
					players[0].count = players[0].count + 0
					players[1].count = players[1].count + 1
				} else {
					players[0].count = players[0].count + 1
					players[1].count = players[1].count + 0
				}
				await battleTeamCharacters(characters, ctx, story, 1, uuid, battle)
			} else if (
				(char_3_1.stats.hp <= 0 || char_3_2.stats.hp <= 0) &&
				battle === 3
			) {
				if (char_3_1.stats.hp <= 0) {
					players[0].count = players[0].count + 0
					players[1].count = players[1].count + 1
				} else {
					players[0].count = players[0].count + 1
					players[1].count = players[1].count + 0
				}
				if (players[1].count > players[0].count) {
					if (players[1].uuid == uuid) {
						await Clan.updateOne(
							{ "name": players[1].clan },
							{ $inc: { "glory": 1, "quest.todayCompleted": 1 } }
						)
						await Rating.updateOne({ uuid }, { $inc: { "teamCharacters": 1 } })
						await User.updateOne(
							{ uuid },
							{
								$inc: { 'resources.crio': 3, 'quest.fourth.countCompleted': 1, "glory": 1 },
							}
						).then(async () => {
							await ctx.replyWithHTML(
								`${story}\n👑 Побеждает 👑\n🪪 <strong>${players[1].player}</strong>.\n⚔️ Кол-во раундов за победу: ${players[1].count} из 3\n🪄 Награда: 3 🧊\n🏆 Слава: 1`
							)
						})
					} else {
						await ctx.replyWithHTML(
							`${story}\n👑 Побеждает 👑\n🪪 <strong>${players[0].player}</strong>.\n⚔️ Кол-во раундов за победу: ${players[0].count} из 3`
						)
					}
				} else {
					if (players[0].uuid == uuid) {
						await Clan.updateOne(
							{ "name": players[0].clan },
							{ $inc: { "glory": 1, "quest.todayCompleted": 1 } }
						)
						await Rating.updateOne({ uuid }, { $inc: { "teamCharacters": 1 } })
						await User.updateOne(
							{ uuid },
							{
								$inc: { 'resources.crio': 3, 'quest.fourth.countCompleted': 1, "glory": 1 },
							}
						).then(async () => {
							await ctx.replyWithHTML(
								`${story}\n👑 Побеждает 👑\n🪪 <strong>${players[0].player}</strong>\n⚔️ Кол-во раундов за победу: ${players[0].count} из 3\n🪄 Награда: 3 🧊\n🏆 Слава: 1`
							)
						})
					} else {
						await ctx.replyWithHTML(
							`${story}\n👑 Побеждает 👑\n🪪 <strong>${players[1].player}</strong>\n⚔️ Кол-во раундов за победу: ${players[1].count} из 3`
						)
					}
				}
			} else {
				await battleTeamCharacters(characters, ctx, story, round, uuid, battle)
			}
		}
	} catch (e) {
		console.error(e)
	}
}

module.exports = {
	battlePlayer,
	battleCharacter,
	battlePlayerInfo,
	battleTeamCharacters,
}

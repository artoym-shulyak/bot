const { Composer, Markup, Extra } = require('telegraf')
const bot = new Composer()
const User = require('../../models/user.model.js')
const Clan = require('../../models/clan.model.js')
const throttle = require('../../utils/throttle.js')

// Обмен на ресурсы
const swappingResources = async (ctx) => {
	try {
		const uuid = String(ctx[0].from.id) // ID user
		const data = ctx[0].match[0] // Information btn
		if (data.indexOf(uuid) === -1) return // Проверка чужокого нажатия на кнопку
		let swap = ctx[3]

	 switch (ctx[3]) {
	  case 'карты':
				await User.findOne({ uuid }).then(async user => {		
					if (user.resources.crio < ctx[1]) {
						await ctx[0].reply(ctx[0].i18n.t('fatal_swap'))
					} else {
						await User.updateOne(
							{ uuid },
							{
								$inc: {
									'resources.crio': -ctx[1],
									'resources.recrute': ctx[2],
									'quest.fifth.countCompleted': 1,
								}
							}
						)
							await ctx[0].reply(
								`✅ Обмен: ${ctx[1]} 🧊 ➠ ${ctx[2]} 🃏 прошел успешно!`
							)
					}
				})
				ctx[0].answerCbQuery('✅ Успешно произведен обмен  ', { cache_time: 3 })
	  	break
	  case 'самоцветы':
				await User.findOne({ uuid }).then(async user => {		
					if (user.resources.crio < ctx[1]) {
						await ctx[0].reply(ctx[0].i18n.t('fatal_swap'))
					} else {
						await User.updateOne(
							{ uuid },
							{
								$inc: {
									'resources.crio': -ctx[1],
									'resources.gems': ctx[2],
									'quest.fifth.countCompleted': 1,
								}
							}
						)
							await ctx[0].reply(
								`✅ Обмен: ${ctx[1]} 🧊 ➠ ${ctx[2]} 💎 прошел успешно!`
							)
					}
				})
				ctx[0].answerCbQuery('✅ Успешно произведен обмен  ', { cache_time: 3 })
	  	break
	  case 'монеты':
				await Clan.findOne({ 'leader.uuid': uuid }).then(async clan => {
					if (clan === null) return
					if (clan.leader.uuid !== uuid) return

					if (clan.money < ctx[1]) {
						await ctx[0].reply(ctx[0].i18n.t('fatal_swap_clan'))
					} else {
						await Clan.updateOne(
							{ 'leader.uuid': uuid },
							{ $inc: { "money": -ctx[1] } }
						).then(async () => {
							for (let i = 0; i < clan.benchEmployees.length; i++) {
								await User.updateOne({"uuid": clan.benchEmployees[i]}, {$inc: { 'resources.crio': ctx[2] }})
							}
			    await ctx[0].reply(
								`✅ Обмен: ${ctx[1]} 🪙 ➠ ${ctx[2]} 🧊 прошел успешно!`
							)
						})
					}

				})

				ctx[0].answerCbQuery('🪙 ➠ 🧊', { cache_time: 3 })
	  	break
	  case 'место':
				await Clan.findOne({ 'leader.uuid': uuid }).then(async clan => {
					if (clan.leader.uuid !== uuid) return
					if (clan.money < ctx[1]) {
						await ctx[0].reply(ctx[0].i18n.t('fatal_swap_clan'))
					} else {
						await Clan.updateOne(
							{ 'leader.uuid': uuid },
							{ $inc: { "money": -ctx[1], "structure": ctx[2] } }
						).then(async () => {
							await ctx[0].reply(
								`✅ Обмен: ${ctx[1]} 🪙 ➠ + ${ctx[2]} 👤 место в клане!`
							)
						})
					}
				})
				ctx[0].answerCbQuery('🪙 ➠ +1 👤', { cache_time: 3 })
	  	break
	  default:
	  	console.log('This swap doesn"t not exist.')
	 }
	} catch (e) {
		console.error(e)
	}
}

// Обмен на аксессуары
const swappingAccessories = async (ctx) => {
	try {
		const uuid = ctx[0].from.id // ID user
		const data = ctx[0].match[0] // Information btn
		if (data.indexOf(uuid) === -1) return // Проверка чужокого нажатия на кнопку

		switch (ctx[2]) {
		  case 'first':
						await User.findOne({ uuid }).then(async user => {
							if (user.resources.crio < ctx[1]) {
								await ctx[0].reply(ctx[0].i18n.t('fatal_swap'))
							} else {
								if (user.resources.amulets.first) {
									await ctx[0].reply('Сучонок 🪬 уже в наличии ✅')
								} else {
									await User.updateOne(
										{ uuid },
										{
											$inc: {
												'resources.crio': -ctx[1],
												'stats.bm': ctx[3],
												'stats.hp': ctx[4],
											},
											$set: { 'resources.amulets.first': true },
										}
									).then(res => console.log(res))
										await ctx[0].reply(
											`✅ Обмен: ${ctx[1]} 🧊 ➠ Сучонок 🪬 прошел успешно!`
										)
								}
							}
						})
						ctx[0].answerCbQuery('✅ Успешно произведен обмен  ', { cache_time: 3 })	
		    break;
		  case 'second':
						await User.findOne({ uuid }).then(async user => {
							if (user.resources.crio < ctx[1]) {
								await ctx[0].reply(ctx[0].i18n.t('fatal_swap'))
							} else {
								if (user.resources.amulets.second) {
									await ctx[0].reply('Дизантэра 🎖 уже в наличии ✅')
								} else {
									await User.updateOne(
										{ uuid },
										{
											$inc: {
												'resources.crio': -ctx[1],
												'stats.hp': ctx[4],
											},
											$set: { 'resources.amulets.second': true },
										}
									).then(res => console.log(res))
										await ctx[0].reply(
											`✅ Обмен: ${ctx[1]} 🧊 ➠ Дизантэра 🎖 прошел успешно!`
										)
								}
							}
						})
						ctx[0].answerCbQuery('✅ Успешно произведен обмен  ', { cache_time: 3 })	
		    break;
		  case 'third':
						await User.findOne({ uuid }).then(async user => {
							if (user.resources.crio < ctx[1]) {
								await ctx[0].reply(ctx[0].i18n.t('fatal_swap'))
							} else {
								if (user.resources.amulets.third) {
									await ctx[0].reply('Демонёнок 🎭 уже в наличии ✅')
								} else {
									await User.updateOne(
										{ uuid },
										{
											$inc: {
												'resources.crio': -ctx[1],
												'stats.bm': ctx[3],
												'stats.hp': ctx[4],
											},
											$set: { 'resources.amulets.third': true },
										}
									).then(res => console.log(res))
										await ctx[0].reply(
											`✅ Обмен: ${ctx[1]} 🧊 ➠ Демонёнок 🎭 прошел успешно!`
										)
								}
							}
						})
						ctx[0].answerCbQuery('✅ Успешно произведен обмен  ', { cache_time: 3 })	
		    break;
		  default:
		    	console.log('error')
		}
	} catch (e) {
		console.error(e)
	}
}

// Троттлинг
let swapResources = throttle(swappingResources, 1500)
let swappAccessories = throttle(swappingAccessories, 1500)

//'🧊 ➠ 🃏' -> Криониты на карточки
bot.action(new RegExp('s_c_first_(.+)'), async ctx => await swapResources([ctx, 95, 5, 'карты']))
bot.action(new RegExp('s_c_second_(.+)'), async ctx => await swapResources([ctx, 135, 10, 'карты']))
bot.action(new RegExp('s_c_third_(.+)'), async ctx => await swapResources([ctx, 245, 30, 'карты']))
// '🧊 ➠ 💎' -> Криониты на самоцветы
bot.action(new RegExp('s_g_first_(.+)'), async ctx => await swapResources([ctx, 185, 5, 'самоцветы']))
bot.action(new RegExp('s_g_second_(.+)'), async ctx => await swapResources([ctx, 340, 15, 'самоцветы']))
bot.action(new RegExp('s_g_third_(.+)'), async ctx => await swapResources([ctx, 549, 40, 'самоцветы']))
// '🧊 ➠ 🔮' -> Криониты на амулеты
bot.action(new RegExp('s_a_first_(.+)'), async ctx => await swappAccessories([ctx, 376, "first", 25000, 75000]))
bot.action(new RegExp('s_a_second_(.+)'), async ctx => await swappAccessories([ctx, 792, "second", 0, 125000]))
bot.action(new RegExp('s_a_third_(.+)'), async ctx => await swappAccessories([ctx, 1200, "third", 500000, 500000]))
// 🪙 ➠ 🧊
bot.action(new RegExp('s_cl_first_c_(.+)'), async ctx => await swapResources([ctx, 9, 5, 'монеты']))
bot.action(new RegExp('s_cl_second_c_(.+)'), async ctx => await swapResources([ctx, 32, 25, 'монеты']))
// 🪙 ➠ 👤
bot.action(new RegExp('s_cl_place_(.+)'), async ctx => await swapResources([ctx, 125, 1, 'место']))
module.exports = bot

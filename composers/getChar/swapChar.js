const { Composer, Markup, Extra } = require('telegraf')
const bot = new Composer()
const User = require('../../models/user.model.js')
const throttle = require('../../utils/throttle.js')

// Обмен дубликат персонажа на Боевую Мощь
const swapCharBm = async (ctx) => {
 	const uuid = ctx[0].from.id // ID user
		const data = ctx[0].match[0] // Information btn
		if (data.indexOf(uuid) === -1) return // Проверка чужокого нажатия на кнопку

		ctx[0].deleteMessage()

	 switch (ctx[1]) {
	  case 'f':
	  	await User.updateOne({uuid}, {$inc:{"stats.bm": 15}})
	  	ctx[0].answerCbQuery('✅', {cache_time: 3})
	  	break
	  case 'e':
	  	await User.updateOne({uuid}, {$inc:{"stats.bm": 56}})
	  	ctx[0].answerCbQuery('✅', {cache_time: 3})
	  	break
	  case 'd':
	  	await User.updateOne({uuid}, {$inc:{"stats.bm": 120}})
	  	ctx[0].answerCbQuery('✅', {cache_time: 3})
	  	break
	  case 'c':
	  	await User.updateOne({uuid}, {$inc:{"stats.bm": 225}})
	  	ctx[0].answerCbQuery('✅', {cache_time: 3})
	  	break
	  case 'b':
	  	await User.updateOne({uuid}, {$inc:{"stats.bm": 450}})
	  	ctx[0].answerCbQuery('✅', {cache_time: 3})
	  	break
	  case 'a':
	  	await User.updateOne({uuid}, {$inc:{"stats.bm": 750}})
	  	ctx[0].answerCbQuery('✅', {cache_time: 3})
	  	break
	  case 's':
	  	await User.updateOne({uuid}, {$inc:{"stats.bm": 1950}})
	  	ctx[0].answerCbQuery('✅', {cache_time: 3})
	  	break
	  case 'ss':
	  	await User.updateOne({uuid}, {$inc:{"stats.bm": 3750}})
	  	ctx[0].answerCbQuery('✅', {cache_time: 3})
	  	break
	  case 'sss':
	  	await User.updateOne({uuid}, {$inc:{"stats.bm": 4800}})
	  	ctx[0].answerCbQuery('✅', {cache_time: 3})
	  	break
	  default:
	  	console.log('This doesn"t swapping on BM...')
	 }
}

// Обмен дубликат персонажа на Живучесть
const swapCharHp = async (ctx) => {
 	const uuid = ctx[0].from.id // ID user
		const data = ctx[0].match[0] // Information btn
		if (data.indexOf(uuid) === -1) return // Проверка чужокого нажатия на кнопку

		ctx[0].deleteMessage()

	 switch (ctx[1]) {
	  case 'f':
	  	await User.updateOne({uuid}, {$inc:{"stats.hp": 60}})
	  	ctx[0].answerCbQuery('✅', {cache_time: 3})
	  	break
	  case 'e':
	  	await User.updateOne({uuid}, {$inc:{"stats.hp": 225}})
	  	ctx[0].answerCbQuery('✅', {cache_time: 3})
	  	break
	  case 'd':
	  	await User.updateOne({uuid}, {$inc:{"stats.hp": 480}})
	  	ctx[0].answerCbQuery('✅', {cache_time: 3})
	  	break
	  case 'c':
	  	await User.updateOne({uuid}, {$inc:{"stats.hp": 900}})
	  	ctx[0].answerCbQuery('✅', {cache_time: 3})
	  	break
	  case 'b':
	  	await User.updateOne({uuid}, {$inc:{"stats.hp": 1800}})
	  	ctx[0].answerCbQuery('✅', {cache_time: 3})
	  	break
	  case 'a':
	  	await User.updateOne({uuid}, {$inc:{"stats.hp": 3000}})
	  	ctx[0].answerCbQuery('✅', {cache_time: 3})
	  	break
	  case 's':
	  	await User.updateOne({uuid}, {$inc:{"stats.hp": 7800}})
	  	ctx[0].answerCbQuery('✅', {cache_time: 3})
	  	break
	  case 'ss':
	  	await User.updateOne({uuid}, {$inc:{"stats.hp": 15000}})
	  	ctx[0].answerCbQuery('✅', {cache_time: 3})
	  	break
	  case 'sss':
	  	await User.updateOne({uuid}, {$inc:{"stats.hp": 19200}})
	  	ctx[0].answerCbQuery('✅', {cache_time: 3})
	  	break
	  default:
	  	console.log('This doesn"t swapping on HP...')
	 }
}

// Обмен дубликат персонажа на крио
const swapCharCrio = async (ctx) => {
 	const uuid = ctx[0].from.id // ID user
		const data = ctx[0].match[0] // Information btn
		if (data.indexOf(uuid) === -1) return // Проверка чужокого нажатия на кнопку

		ctx[0].deleteMessage()

	 switch (ctx[1]) {
	  case 'f':
	  	await User.updateOne({uuid}, {$inc:{"resources.crio": 1}})
	  	ctx[0].answerCbQuery('✅', {cache_time: 3})
	  	break
	  case 'e':
	  	await User.updateOne({uuid}, {$inc:{"resources.crio": 2}})
	  	ctx[0].answerCbQuery('✅', {cache_time: 3})
	  	break
	  case 'd':
	  	await User.updateOne({uuid}, {$inc:{"resources.crio": 2}})
	  	ctx[0].answerCbQuery('✅', {cache_time: 3})
	  	break
	  case 'c':
	  	await User.updateOne({uuid}, {$inc:{"resources.crio": 2}})
	  	ctx[0].answerCbQuery('✅', {cache_time: 3})
	  	break
	  case 'b':
	  	await User.updateOne({uuid}, {$inc:{"resources.crio": 3}})
	  	ctx[0].answerCbQuery('✅', {cache_time: 3})
	  	break
	  case 'a':
	  	await User.updateOne({uuid}, {$inc:{"resources.crio": 4}})
	  	ctx[0].answerCbQuery('✅', {cache_time: 3})
	  	break
	  case 's':
	  	await User.updateOne({uuid}, {$inc:{"resources.crio": 5}})
	  	ctx[0].answerCbQuery('✅', {cache_time: 3})
	  	break
	  case 'ss':
	  	await User.updateOne({uuid}, {$inc:{"resources.crio": 9}})
	  	ctx[0].answerCbQuery('✅', {cache_time: 3})
	  	break
	  case 'sss':
	  	await User.updateOne({uuid}, {$inc:{"resources.crio": 15}})
	  	ctx[0].answerCbQuery('✅', {cache_time: 3})
	  	break
	  default:
	  	console.log('This doesn"t swapping on crio...')
	 }
}

// Троттлиенг
let throttleSwapCharCrio = throttle(swapCharCrio, 1500)
let throttleSwapCharBm = throttle(swapCharBm, 1500)
let throttleSwapCharHp = throttle(swapCharHp, 1500)

// Actions
// Crio
bot.action(new RegExp('swap_f_crio_(.+)'), ctx => throttleSwapCharCrio([ctx, 'f']))
bot.action(new RegExp('swap_e_crio_(.+)'), ctx => throttleSwapCharCrio([ctx, 'e']))
bot.action(new RegExp('swap_d_crio_(.+)'), ctx => throttleSwapCharCrio([ctx, 'd']))
bot.action(new RegExp('swap_c_crio_(.+)'), ctx => throttleSwapCharCrio([ctx, 'c']))
bot.action(new RegExp('swap_b_crio_(.+)'), ctx => throttleSwapCharCrio([ctx, 'b']))
bot.action(new RegExp('swap_a_crio_(.+)'), ctx => throttleSwapCharCrio([ctx, 'a']))
bot.action(new RegExp('swap_s_crio_(.+)'), ctx => throttleSwapCharCrio([ctx, 's']))
bot.action(new RegExp('swap_ss_crio_(.+)'), ctx => throttleSwapCharCrio([ctx, 'ss']))
bot.action(new RegExp('swap_sss_crio_(.+)'), ctx => throttleSwapCharCrio([ctx, 'sss']))
// BM
bot.action(new RegExp('swap_f_bm_(.+)'), ctx => throttleSwapCharBm([ctx, 'f']))
bot.action(new RegExp('swap_e_bm_(.+)'), ctx => throttleSwapCharBm([ctx, 'e']))
bot.action(new RegExp('swap_d_bm_(.+)'), ctx => throttleSwapCharBm([ctx, 'd']))
bot.action(new RegExp('swap_c_bm_(.+)'), ctx => throttleSwapCharBm([ctx, 'c']))
bot.action(new RegExp('swap_b_bm_(.+)'), ctx => throttleSwapCharBm([ctx, 'b']))
bot.action(new RegExp('swap_a_bm_(.+)'), ctx => throttleSwapCharBm([ctx, 'a']))
bot.action(new RegExp('swap_s_bm_(.+)'), ctx => throttleSwapCharBm([ctx, 's']))
bot.action(new RegExp('swap_ss_bm_(.+)'), ctx => throttleSwapCharBm([ctx, 'ss']))
bot.action(new RegExp('swap_sss_bm_(.+)'), ctx => throttleSwapCharBm([ctx, 'sss']))
// HP
bot.action(new RegExp('swap_f_hp_(.+)'), ctx => throttleSwapCharHp([ctx, 'f']))
bot.action(new RegExp('swap_e_hp_(.+)'), ctx => throttleSwapCharHp([ctx, 'e']))
bot.action(new RegExp('swap_d_hp_(.+)'), ctx => throttleSwapCharHp([ctx, 'd']))
bot.action(new RegExp('swap_c_hp_(.+)'), ctx => throttleSwapCharHp([ctx, 'c']))
bot.action(new RegExp('swap_b_hp_(.+)'), ctx => throttleSwapCharHp([ctx, 'b']))
bot.action(new RegExp('swap_a_hp_(.+)'), ctx => throttleSwapCharHp([ctx, 'a']))
bot.action(new RegExp('swap_s_hp_(.+)'), ctx => throttleSwapCharHp([ctx, 's']))
bot.action(new RegExp('swap_ss_hp_(.+)'), ctx => throttleSwapCharHp([ctx, 'ss']))
bot.action(new RegExp('swap_sss_hp_(.+)'), ctx => throttleSwapCharHp([ctx, 'sss']))




// bot.action(new RegExp('swap_f_crio_(.+)'), ctx => throttleSwapCharResourse([ctx, 'f_bm']))
// bot.action(new RegExp('swap_f_crio_(.+)'), ctx => throttleSwapCharResourse([ctx, 'f_hp']))

module.exports = bot
const { Markup, Extra } = require('telegraf')
const fs = require('fs')
const User = require('../../models/user.model.js')
const Rating = require('../../models/rating.model.js')
const Characters = require('../../models/characters.model.js')

const lerp = (min, max, value) => ((1 - value) * min + value * max);

const drop = items => {
 const total = items.reduce((accumulator, item) => (accumulator + item.dropChance), 0);
 const chance = lerp(0, total, Math.random());

 let current = 0;
 for (const item of items) {
 				// console.log(item)
     if (current <= chance && chance < current + item.dropChance) {
         return item;
     }

     current += item.dropChance;
 }
};

// Получение персоонажа
const getChar = async (uuid, ctx) => {
	try {
		let char
		
		await Characters.find({})
		.then(async chars => {
			char = drop(chars)
		})

		await User.findOne({ uuid }).then(async user => {
			if (user == null) return
			if (user.resources.recrute <= 0) return

			if (!user.characters.includes(char.uuid)) {
				await Rating.updateOne({uuid}, {$inc:{"recruteChar": 1}})
				await User.updateOne(
					{ uuid },
					{
						$inc: {
							'stats.bm': char.stats.bm,
							'stats.hp': char.stats.hp,
							'resources.recrute': -1,
							"quest.first.countCompleted": 1
						},
						$push: { characters: char.uuid },
					}
				)
				await ctx.replyWithPhoto(
					{ source: fs.createReadStream(char.image) },
					{ caption: ctx.i18n.t('getCard', { user, char }), parse_mode: 'HTML' }
				)
			} else {
				await Rating.updateOne({uuid}, {$inc:{"recruteChar": 1}})
				switch (char.rank) {
					case 'F':
						await User.updateOne(
							{ uuid },
							{
								$inc: {
									'resources.recrute': -1,
									"quest.first.countCompleted": 1
								},
							}
						)
						await ctx.replyWithPhoto(
							{ source: fs.createReadStream(char.image) },
							{
								caption: ctx.i18n.t('getCardRepeat', {
									user,
									char,
								}),
								...Extra.markup( 
									Markup.inlineKeyboard([
										Markup.callbackButton('+ 🧊 1', `swap_f_crio_${uuid}`),
										Markup.callbackButton('+ 💥 15', `swap_f_bm_${uuid}`),
										Markup.callbackButton('+ ❤️ 60', `swap_f_hp_${uuid}`),
									])
								),
								parse_mode: 'HTML',
							}
						)
						break
					case 'E':
						await User.updateOne(
							{ uuid },
							{
								$inc: {
									'resources.recrute': -1,
									"quest.first.countCompleted": 1
								},
							}
						)
						await ctx.replyWithPhoto(
							{ source: fs.createReadStream(char.image) },
							{
								caption: ctx.i18n.t('getCardRepeat', {
									user,
									char,
								}),
								...Extra.markup( 
									Markup.inlineKeyboard([
										Markup.callbackButton('+ 🧊 2', `swap_e_crio_${uuid}`),
										Markup.callbackButton('+ 💥 56', `swap_e_bm_${uuid}`),
										Markup.callbackButton('+ ❤️ 225', `swap_e_hp_${uuid}`),
									])
								),
								parse_mode: 'HTML',
							}
						)
						break
					case 'D':
						await User.updateOne(
							{ uuid },
							{
								$inc: {
									'resources.recrute': -1,
									"quest.first.countCompleted": 1
								},
							}
						)
						await ctx.replyWithPhoto(
							{ source: fs.createReadStream(char.image) },
							{
								caption: ctx.i18n.t('getCardRepeat', {
									user,
									char,
								}),
								...Extra.markup( 
									Markup.inlineKeyboard([
										Markup.callbackButton('+ 🧊 2', `swap_e_crio_${uuid}`),
										Markup.callbackButton('+ 💥 120', `swap_e_bm_${uuid}`),
										Markup.callbackButton('+ ❤️ 480', `swap_e_hp_${uuid}`),
									])
								),
								parse_mode: 'HTML',
							}
						)
						break
					case 'C':
						await User.updateOne(
							{ uuid },
							{
								$inc: {
									'resources.recrute': -1,
									"quest.first.countCompleted": 1
								},
							}
						)
						await ctx.replyWithPhoto(
							{ source: fs.createReadStream(char.image) },
							{
								caption: ctx.i18n.t('getCardRepeat', {
									user,
									char,
								}),
								...Extra.markup( 
									Markup.inlineKeyboard([
										Markup.callbackButton('+ 🧊 2', `swap_c_crio_${uuid}`),
										Markup.callbackButton('+ 💥 225', `swap_c_bm_${uuid}`),
										Markup.callbackButton('+ ❤️ 900', `swap_c_hp_${uuid}`),
									])
								),
								parse_mode: 'HTML',
							}
						)
						break
					case 'B':
						await User.updateOne(
							{ uuid },
							{
								$inc: {
									'resources.recrute': -1,
									"quest.first.countCompleted": 1
								},
							}
						)
						await ctx.replyWithPhoto(
							{ source: fs.createReadStream(char.image) },
							{
								caption: ctx.i18n.t('getCardRepeat', {
									user,
									char,
								}),
								...Extra.markup( 
									Markup.inlineKeyboard([
										Markup.callbackButton('+ 🧊 3', `swap_b_crio_${uuid}`),
										Markup.callbackButton('+ 💥 450', `swap_b_bm_${uuid}`),
										Markup.callbackButton('+ ❤️ 1.8K', `swap_b_hp_${uuid}`),
									])
								),
								parse_mode: 'HTML',
							}
						)
						break
					case 'A':
						await User.updateOne(
							{ uuid },
							{
								$inc: {
									'resources.recrute': -1,
									"quest.first.countCompleted": 1
								},
							}
						)
						await ctx.replyWithPhoto(
							{ source: fs.createReadStream(char.image) },
							{
								caption: ctx.i18n.t('getCardRepeat', {
									user,
									char,
								}),
								...Extra.markup( 
									Markup.inlineKeyboard([
										Markup.callbackButton('+ 🧊 4', `swap_a_crio_${uuid}`),
										Markup.callbackButton('+ 💥 750', `swap_a_bm_${uuid}`),
										Markup.callbackButton('+ ❤️ 3K', `swap_a_hp_${uuid}`),
									])
								),								
								parse_mode: 'HTML',
							}
						)
						break
					case 'S':
						await User.updateOne(
							{ uuid },
							{
								$inc: {
									'resources.recrute': -1,
									"quest.first.countCompleted": 1
								},
							}
						)
						await ctx.replyWithPhoto(
							{ source: fs.createReadStream(char.image) },
							{
								caption: ctx.i18n.t('getCardRepeat', {
									user,
									char,
								}),
								...Extra.markup( 
									Markup.inlineKeyboard([
										Markup.callbackButton('+ 🧊 5', `swap_s_crio_${uuid}`),
										Markup.callbackButton('+ 💥 1.9K', `swap_s_bm_${uuid}`),
										Markup.callbackButton('+ ❤️ 7.8K', `swap_s_hp_${uuid}`),
									])
								),							
								parse_mode: 'HTML',
							}
						)
						break
					case 'SS':
						await User.updateOne(
							{ uuid },
							{
								$inc: {
									'resources.recrute': -1,
									"quest.first.countCompleted": 1
								},
							}
						)
						await ctx.replyWithPhoto(
							{ source: fs.createReadStream(char.image) },
							{
								caption: ctx.i18n.t('getCardRepeat', {
									user,
									char,
								}),
								...Extra.markup( 
									Markup.inlineKeyboard([
										Markup.callbackButton('+ 🧊 9', `swap_ss_crio_${uuid}`),
										Markup.callbackButton('+ 💥 3.7K', `swap_ss_bm_${uuid}`),
										Markup.callbackButton('+ ❤️ 15K', `swap_ss_hp_${uuid}`),
									])
								),								
								parse_mode: 'HTML',
							}
						)
						break
					case 'SSS':
						await User.updateOne(
							{ uuid },
							{
								$inc: {
									'resources.recrute': -1,
									"quest.first.countCompleted": 1
								},
							}
						)
						await ctx.replyWithPhoto(
							{ source: fs.createReadStream(char.image) },
							{
								caption: ctx.i18n.t('getCardRepeat', {
									user,
									char,
								}),
								...Extra.markup( 
									Markup.inlineKeyboard([
										Markup.callbackButton('+ 🧊 15', `swap_sss_crio_${uuid}`),
										Markup.callbackButton('+ 💥 4.8K', `swap_sss_bm_${uuid}`),
										Markup.callbackButton('+ ❤️ 19.2K', `swap_sss_hp_${uuid}`),
									])
								),
								parse_mode: 'HTML',
							}
						)
						break
					default:
						await ctx.reply('Ошибка...')
				}
			}
		})
	} catch (e) {
		console.error(e)
	}
}

module.exports = getChar


const fs = require('fs')
const { Composer, Markup, Extra } = require('telegraf')
const bot = new Composer()
const Characters = require('../../models/characters.model.js')
const User = require('../../models/user.model.js')
const throttle = require('../../utils/throttle.js')

const serachCharacter = async (ctx) => {
	try {
		let characters = await Characters.find()
		let nameChar

		if (await User.findOne({uuid}) == null) return

		switch (ctx[1]) {
		 case 'text':
				nameChar = ctx[0].message.text
					.replace(/.поиск/i, '')
					.toLowerCase()
					.trim()

				await Characters.findOne({search: nameChar})
				.then(async char => {
					if (char) {
						await ctx[0].replyWithPhoto(
							{ source: fs.createReadStream(char.image) },
							{
								caption: ctx[0].i18n.t('infoChar', { char }),
								parse_mode: 'HTML',
							}
						)
					} 
				})
		 	break
		 case 'hashtag':
				nameChar = ctx[0].message.text.replace(/\/f/i, '').toLowerCase().trim()

				await Characters.findOne({hashtag: nameChar})
				.then(async char => {
					if (char) {
						await ctx[0].replyWithPhoto(
							{ source: fs.createReadStream(char.image) },
							{
								caption: ctx[0].i18n.t('infoChar', { char }),
								parse_mode: 'HTML',
							}
						)
					} 
				})

		 	break
		 default:
		 	console.log('This character doens"t not exist.')
		}


	} catch (e) {
		console.error(e)
	}
}

// Троттлинг
let throttleSerachCharacter = throttle(serachCharacter, 3000)

// Messages
bot.hears(/\.поиск(.+)/i, ctx => throttleSerachCharacter([ctx, 'text']))
bot.hears(/\/f(.+)/i, ctx => throttleSerachCharacter([ctx, 'hashtag']))

module.exports = bot

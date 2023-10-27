const { Composer, Markup, Extra } = require('telegraf')
const bot = new Composer()
const getChar = require('./getChar.js')
const throttle = require('../../utils/throttle.js')

bot.use(require('./searchChar.js')) // Поиск персонажа по имени
bot.use(require('./swapChar.js')) // Поиск персонажа по имени

// Получение персонажа
const getCharacter = async (ctx) => {
		try {
			const uuid = ctx.message.from.id

			getChar(uuid, ctx)
		} catch (e) {
			console.error(e)
		}
}

// Троттлинг
let throttleGetChar = throttle(getCharacter, 700)

// Actions
bot.hears([new RegExp('найм', 'i'),new RegExp('нанять персонажа', 'i'),new RegExp('🃏 нанять персонажа', 'i'),], ctx => throttleGetChar(ctx))

module.exports = bot


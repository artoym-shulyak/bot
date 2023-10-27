require('./utils/dataBase.js')
const bot = require('./utils/telegramBot.js')
const i18n = require('./utils/i18n.js')

// -> Etc...
bot.use(i18n.middleware())

// -> Other actions for Bot
bot.use(require('./composers/start/index'))
bot.use(require('./composers/studia/index'))
bot.use(require('./composers/getChar/index'))
bot.use(require('./composers/settings/index'))
bot.use(require('./composers/world/index'))
bot.use(require('./composers/shop/index'))
bot.use(require('./composers/amulets/index'))
bot.use(require('./composers/donat/index'))
bot.use(require('./composers/books/index'))
bot.use(require('./composers/cards/index'))
bot.use(require('./composers/swap/index'))
bot.use(require('./composers/rating/index'))
bot.use(require('./composers/vipCard/index'))
bot.use(require('./composers/bonus/index'))
bot.use(require('./composers/referral/index'))
bot.use(require('./composers/quest/index'))
bot.use(require('./composers/backpack/index'))
bot.use(require('./composers/events/index'))
bot.use(require('./composers/myCharacters/index'))
bot.use(require('./composers/battle/index'))
bot.use(require('./composers/black_market/index'))
bot.use(require('./composers/clan/index'))
bot.use(require('./composers/market/index'))
bot.use(require('./composers/updateTimes/index'))
bot.use(require('./composers/admin/index'))

// -> Started Bot
bot
	.launch()
	.then(() => {
		console.log('Bot started!')
	})
	.catch(err => console.log(err))

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

 
// Задачи ----->
// 1) 

//----
// Разобраться как правильно делать пагинацию (mongoose)

// Компоненты --->
// 1) Старт ✅
// 2) Студия ✅
//     1. Сражение ✅
//     2. Рейтинг ✅
//     3. Ежедневно ✅
//     4. Мир ✅
//     5. Рюкзак ✅
//     6. Настройки ✅
// 2) Мир
//     1. Таверна ✅
//     2. Бонус ✅
//     3. Гильдия ✅
//     4. VIP ✅
// 7) Таверна
//     1. Амулеты ✅
//     2. Библиотека ✅
//     3. Лавка ✅
//     4. Черный рынок ✅
//     5. Карты ✅
//     6. Обмен ✅
//     8. Биржа ✅

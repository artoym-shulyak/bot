const { Composer } = require('telegraf')
const bot = new Composer()
const User = require('../../models/user.model.js')
const Clan = require('../../models/clan.model.js')
const { _getRandomInt } = require('../../utils/random.js')

// Таймер обновление заданий
async function updateOclockDailyQuestTask() {
	try {
		if (
			new Date().getHours() == 21 &&
			new Date().getMinutes() == 0 &&
			new Date().getSeconds() == 0
		) {
			await User.bulkWrite([
				{
					updateMany: {
						filter: { 'deadlines.bookFirst.state': true },
						update: { $inc: { 'stats.hp': 3000, 'resources.recrute': 1 } },
					},
				},
				{
					updateMany: {
						filter: { 'deadlines.bookSecond.state': true },
						update: { $inc: { 'stats.hp': 5000, 'stats.bm': 5000 } },
					},
				},
				{
					updateMany: {
						filter: { 'deadlines.bookThird.state': true },
						update: {
							$inc: {
								'stats.hp': 24000,
								'stats.bm': 12000,
								'resources.recrute': 5,
							},
						},
					},
				},
				{
					updateMany: {
						filter: {},
						update: {
							$set: {
								// Задание 1
								'quest.first.countCompleted': 0,
								'quest.first.count': _getRandomInt(1, 3),
								'quest.first.completed': false,
								'quest.first.stateReward': false,
								'quest.first.reward': _getRandomInt(1, 10),
								// Задание 2
								'quest.second.countCompleted': 0,
								'quest.second.count': _getRandomInt(3, 6),
								'quest.second.completed': false,
								'quest.second.stateReward': false,
								'quest.second.reward': _getRandomInt(1, 10),
								// Задание 3
								'quest.third.countCompleted': 0,
								'quest.third.count': _getRandomInt(3, 6),
								'quest.third.completed': false,
								'quest.third.stateReward': false,
								'quest.third.reward': _getRandomInt(1, 10),
								// Задание 4
								'quest.fourth.countCompleted': 0,
								'quest.fourth.count': _getRandomInt(3, 6),
								'quest.fourth.completed': false,
								'quest.fourth.stateReward': false,
								'quest.fourth.reward': _getRandomInt(1, 10),
								// Задание 5
								'quest.fifth.countCompleted': 0,
								'quest.fifth.count': _getRandomInt(1, 3),
								'quest.fifth.completed': false,
								'quest.fifth.stateReward': false,
								'quest.fifth.reward': _getRandomInt(1, 3),
								// Реферально задание
								'referral.count': _getRandomInt(1, 3),
								'referral.reward': _getRandomInt(1, 3),
								'referral.completed': false,
								'referral.stateReward': false,
								'referral.todayCompleted': 0,
							},
						},
					},
				},
			])
			await Clan.updateMany(
				{},
				{
					$set: {
						'quest.countCompleted': 0,
						'quest.count': _getRandomInt(15, 60),
						'quest.completed': false,
						'quest.stateReward': false,
						'quest.reward': _getRandomInt(1, 3),
					},
				}
			)
		}
	} catch (e) {
		console.error(e)
	}
}

updateOclockDailyQuestTask()
setInterval(updateOclockDailyQuestTask, 1000)

module.exports = bot

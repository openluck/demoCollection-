import { Wechaty } from 'wechaty'
import { CronJob } from 'cron'
import { randomQuestion } from '../message/interview'

// 找到前端面试，及前端进阶开头的群名，每天 9:45 定时推送
export default async (bot: Wechaty) => {
  return new CronJob('0 9 * * *', async () => {
    const rooms = await bot.Room.findAll({ topic: /前端面试|前端进阶/ })
    const q = await randomQuestion()
    for (const room of rooms) {
      // const alias = await room.
      for (const text of q) {
        if (room.owner().name().includes('山月')) {
          await room.say(text)
        }
      }
    }
  }, null, true, 'Asia/Shanghai')
}

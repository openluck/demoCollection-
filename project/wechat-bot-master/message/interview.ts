const axios = require('axios')

const api = 'https://we.shanyue.tech/api/issues/random'

function getQuestion () {
  return axios.get(api).then(({ data }) => {
    return data.data[0]
  })
}

export const randomQuestion = async () => {
  const q = await getQuestion()
  const title = `今日面试题：${q.title.slice(6)}

可以在此进行讨论 https://github.com/shfshanyue/Daily-Question/issues/${q.number}

---
每天九点自动推送一道面试题
`
  const answer = q?.comment?.body || ''
  return [title, answer]
}

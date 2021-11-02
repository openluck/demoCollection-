import { request } from './../../util/request'

export function setTimeFun(url, time, isOne) {
  let ktVideoTime = localStorage.getItem('ktVideoTime')
  if (ktVideoTime) {
    ktVideoTime = JSON.parse(ktVideoTime)
    let idx = 0
    let one = ktVideoTime.find((item, index) => {
      if (url === item.url) {
        idx = index
        return true
      }
    })
    if (one) {
      if (one.isOne === isOne) {
        ktVideoTime[idx].time = time
        ktVideoTime[idx].date = new Date().getTime()
      } else {
        ktVideoTime.push({
          url,
          time,
          isOne,
          date: new Date().getTime()
        })
      }
    } else {
      ktVideoTime.push({
        url,
        time,
        isOne,
        date: new Date().getTime()
      })
    }
  } else {
    ktVideoTime = [{
      url,
      time,
      isOne,
      date: new Date().getTime()
    }]
  }
  localStorage.setItem('ktVideoTime', JSON.stringify(ktVideoTime))
}

export function getTimeFun (url, isOne) {
  let time = null
  let ktVideoTime = localStorage.getItem('ktVideoTime')
  if (ktVideoTime) {
    ktVideoTime = JSON.parse(ktVideoTime)
    let idx = 0
    let one = ktVideoTime.find((item, index) => {
      if (url === item.url) {
        idx = index
        return true
      }
    })
    if (one) {
      if (one.isOne === isOne) {
        return ktVideoTime[idx].time
      }
      return time
    }
  }
  return time
}

export function delWeekVideo() {
  let ktVideoTime = localStorage.getItem('ktVideoTime')
  if (ktVideoTime) {
    ktVideoTime = JSON.parse(ktVideoTime)
    let now = new Date().getTime()
    ktVideoTime = ktVideoTime.map(item => {
      if (now - item.date <= 604800000)
        return item
    })
    if (ktVideoTime && ktVideoTime[0]) {
      localStorage.setItem('ktVideoTime', JSON.stringify(ktVideoTime))
    } else {
      localStorage.removeItem('ktVideoTime')
    }
  }
} 

export function keepOnLine (token) {
  request('keepOnLine', { token }, res => {
    console.log('res', res)
  })
}


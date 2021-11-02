/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-11-01 17:11:15
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-11-01 17:12:39
 */
function Promise(executor) {
  this.status = 'pending'
  this.value = null
  this.reason = null
  //箭头函数保证resolve和reject方法能够拿到Promise实例的值
  const resolve = value => {
    this.value = value
  }
  const reject = reason => {
    this.reason = reason
  }
  executor(resolve, reject)
}
Promise.prototype.then = function (onfulfilled, onrejected) {
  onfulfilled(this.value)
  onrejected(this.error)
}


let promise = new Promise((resolve, reject) => {
  resolve('data')
  reject('error')
})
promise.then(data => {
  console.log(data)
}, error => {
  console.log(error)
})


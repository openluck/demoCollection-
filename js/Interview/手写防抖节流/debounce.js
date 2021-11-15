/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-11-15 11:37:30
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-11-15 11:41:09
 */
// https://mp.weixin.qq.com/s/fNrn94emmLMfuKN_Ukpi6A
function debounce(fn, wait, immediate) {
  let timer = null;
  //  返回一个函数
  return function (...args) {
    // 每次触发事件时都取消之前的定时器
    clearTimeout(timer);
    // 判断是否要立即执行一次
    if (immediate && !timer) {
      fn.apply(this, args);
    }
    // setTimeout中使用箭头函数，就是让 this指向 返回的该闭包函数，而不是 debounce函数的调用者
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, wait)
  }
}
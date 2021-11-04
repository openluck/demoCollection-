/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-11-03 13:59:05
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-11-03 14:07:50
 */
let arr = [1, 2, 3, 4, 4, 5, 5, 6, 6, 6, 7];
let arr2=  arr.filter((item,index,arr) => {
  arr.indexOf(item, 0) === index
})
console.log('arr',arr);
console.log('arr2',arr2);
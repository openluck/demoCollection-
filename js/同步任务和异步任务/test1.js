/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-10-22 10:12:18
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-22 10:45:32
 */
// console.log('同步任务1');

//  setTimeout(async () => {
//     console.log('异步任务');
// }, 1000);

// console.log('同步任务2');

// setTimeout(() => {
//   console.log('异步任务');
// }, 2000);

// // 伪代码
// sleep(5000); //表示很耗时的同步任务


const p = new Promise((resolve, reject) => {
  resolve(1); // 代码执行到这里时， promise状态是 fulfilled
  reject(2); // 尝试修改状态为 rejected，是不行的。因为状态执行到上一行时，已经被改变了。
});

p.then((res) => {
  console.log(res);
}).catch((err) => {
  console.log(err);
});


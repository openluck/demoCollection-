/*
 * @Descripttion:
 * @version:
 * @Author: OpenLcuk
 * @Date: 2021-11-15 10:34:15
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-11-15 11:05:32
 */
// https://juejin.cn/post/6844903929705136141

let obj1 = {
  name: 'liu',
  age: 19
}

// let obj2 = obj1  
// obj2.name = "jack"
// console.log(obj1);  // jack
/*
  浅拷贝
  * 创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝。
  * 如果属性是基本类型，拷贝的就是基本类型的值，如果属性是引用类型，
  * 拷贝的就是内存地址 ，所以如果其中一个对象改变了这个地址，就会影响到另一个对象。
*/
// 通过递归来深层次的拷贝对象， 
// 缺点：没有 考虑到数组的问题
// function clone(target) {
//   if (typeof target === 'object') {
//     let cloneTarget = {};
//     for (const key in target) {
//       cloneTarget[key] = clone(target[key]);
//     }
//     return cloneTarget;
//   } else {
//     return target;
//   }
// };

// 兼容数组
function clone(target) {
  if (typeof target === 'object') {  // 数组通过typeod  判断也是对象 object
    let cloneTarget = Array.isArray(target) ? [] : {};  // 就这句话兼容了数组
    for (const key in target) {
      cloneTarget[key] = clone(target[key]);
    }
    return cloneTarget;
  } else {
    return target;
  }
};


// let a = 2;   ----> 基本类型  不存在深浅拷贝问题
// let b = a
// b = 3;
// console.log(a);


/*  
  ps
  1： 深拷贝需要考虑的就是 对象，数组深层嵌套问题
*/

module.exports = clone
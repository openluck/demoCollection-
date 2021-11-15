/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-11-15 10:54:33
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-11-15 10:57:05
 */
const clone = require('./copy')
const target = {
  field1: 1,
  field2: undefined,
  field3: 'ConardLi',
  field4: {
    child: 'child',
    child2: {
      child2: 'child2'
    }
  }
};

const result = clone(target);

console.log(result);
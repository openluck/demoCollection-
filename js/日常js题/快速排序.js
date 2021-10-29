/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-10-29 15:32:56
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-29 16:05:56
 */
/**
 * --- 测试用例 ---
 *
 * 输入：[1, 34, 5, 76, 8, 6, 9, 7, 6, 3]
 * 输出：[1, 3, 5, 6, 6, 7, 8, 9, 34, 76]
 *
 * --- 说明 ---
 * 
 * 思考：快速排序是稳定的吗？
 * 解答
 */

//  https://www.ruanyifeng.com/blog/2011/04/quicksort_in_javascript.html


// const quickSort = (nums) => {
//   if (nums.length < 2) {
//     return nums;
//   } else {
//     var left = [];
//     var right = [];
//     var pivot = Math.floor(nums.length / 2); // Math.floor 向下取整
//     var base = nums.splice(pivot, 1)[0];
//     for (let i = 0; i < nums.length; i++) {
//       if (nums[i] < base) {
//         left.push(nums[i]);
//       } else {
//         right.push(nums[i]);
//       }
//     }
//   }
//   return quickSort(left).concat([base], quickSort(right));
// }


var quickSort = function (arr) {
  if (arr.length <= 1) { return arr; }
  var pivotIndex = Math.floor(arr.length / 2);
  var pivot = arr.splice(pivotIndex, 1)[0];
  console.log('pivot', pivot);
  var left = [];
  var right = [];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return quickSort(left).concat([pivot], quickSort(right));
};

let arr = [1, 34, 5, 76, 8, 6, 9, 7, 6, 3]
quickSort(arr)
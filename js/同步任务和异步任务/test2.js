let arr1 = [1, 2, 3]
let arr2 = [1, 2, 3, 4]
let arr3 = []
// let arr3 = Array.from(new Set([...arr1, ...arr2]))

arr3 = arr2.filter(item => !arr1.includes(item))
console.log(arr3);
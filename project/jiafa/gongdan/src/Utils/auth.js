/**
 * 多维数组转一维数组
 * @param {*} arr
 */
export function flatten(arr) {
    var res = [];
    for (var i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
            res = res.concat(flatten(arr[i]));
        } else {
            res.push(arr[i]);
        }
    }
    return res;
}
/**
 * 鉴权
 * @param {*} authority
 */
export function check(authority) {
    authority = String(authority)
    const current = JSON.parse(JSON.parse(sessionStorage.getItem("userInfo")).permission);
    const arr = flatten(current);
    return arr.includes(authority);
}


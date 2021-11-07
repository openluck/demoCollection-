/**
 * 处理图表百分比跳转参数
 * @param {string} data 参数具体值 例70%-80%
 */
function jumpFun(data) {
    let rateArr = []; //[0]:最小值 [1]:最大值
    if (data) {
        let keyIndex = data.indexOf('%')
        if (data.indexOf('以上') >= 0) {
            rateArr[1] = null;
            rateArr[0] = data.substring(0, keyIndex)
        } else if (data.indexOf('以下') >= 0) {
            rateArr[0] = null;
            rateArr[1] = data.substring(0, keyIndex)
        } else {
            let tempArr = [];
            let temp = []
            if (data.indexOf('-')) {
                tempArr = data.split('-')
                temp = tempArr.length && tempArr.map(item => {
                    return item.replace(/[%]/, '')
                })
            }
            rateArr = temp
        }
        return rateArr
    }
}
//考勤类型码表
const attCode = {
    teaAttNormal: 1,
    teaAttLate: 2,
    teaEarly: 3,
    teaAttAbsence: 4,
    teaAttExchange: 5,
    leave: 6,
}
const attCodeOne = {
    normal: 1,
    beLate: 2,
    leaveEarly: 3,
    absence: 4,
    courseChange: 5,
    leave: 6,
}
/**
 * 获取考勤字段对应key
 * @param {string} str 字段名
 * @param {Number} type 类型  0学校画像、学院画像 1教师画像、课程画像
 */
function getAttCode(str, type) {
    let keyCode;
    if (str) {
        let data = type ? attCodeOne : attCode
        for (let i in data) {
            if (str == i) {
                keyCode = data[i];
                break;
            }
        }
    }
    return keyCode
}
export { jumpFun, getAttCode };
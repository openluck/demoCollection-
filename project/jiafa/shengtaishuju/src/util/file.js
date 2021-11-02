/*
 * @Author: mikey.zhaopeng 
 * @Date: 2020-02-14 16:25:08 
 * @Last Modified by: lxx
 * @Last Modified time: 2020-07-24 17:30:58
 * 公共函数封装
 */
import U from "./_util";
const toChinese = U.toChinese;

const clientSizeChange = function () {
    function clientWidth() {
        let width = document.documentElement.clientWidth || document.body.clientWidth
        return width
    }

    let width = clientWidth();
    if (width < 2047) {
        return 1
    } else if (width >= 2048 && width < 2399) {
        return 1.2
    } else if (width >= 2400 && width < 2899) {
        return 1.4
    } else if (width >= 2900 && width < 3099) {
        return 1.5
    } else if (width >= 3100 && width < 3799) {
        return 1.6
    } else if (width >= 3800) {
        return 2
    }
}

/**
 * 返回文件后缀
 * @param {*String} fileName 上传的文件名字
 */
export const getFileSuffix = function (fileName) {
    if (typeof (fileName) === 'string' && fileName.indexOf('.') > -1) {
        let args = fileName.split('.');
        return args[args.length - 1];
    } else {
        console.log('传入参数必须为文件名且不能为空且必须为字符串！');
    }
}

/**
 * 去掉第一个一
 * @param {String} num 
 */
const getSection = (num) => {
    let chWeek;
    if (num) {
        chWeek = toChinese(Number(num));
        if (chWeek.indexOf('一') > -1 && chWeek !== '一') {
            chWeek = chWeek.substring(1, chWeek.length);
        }
        return chWeek;
    }
}
export default { clientSizeChange, getSection }
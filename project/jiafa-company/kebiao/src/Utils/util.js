import moment from "moment";
/**
 * 删除时获取页码
 * 调用时直接赋值
 * 调用前需引入
 * 例:import { tablePages } from "../../Utils/util";
 * 使用方法(调用删除接口后):this.pagination.current = tablePages(this.pagination,this.checkList.length);
 * @param {pages,total,pageSize,current} paginations // 传入删除的paginations包含四个参数
 * @param {Number} length  // 删除的数组长度
 * @returns
 * 返回当前页码
 */
function tablePages(paginations, length) {
  let obj = paginations;
  if (obj.current === 1 || obj.current !== obj.pages) {
    return obj.current;
  } else {
    let lastLength = obj.total - (obj.pages - 1) * obj.pageSize;
    if (lastLength === length) {
      return obj.current - 1;
    } else {
      return obj.current;
    }
  }
}
/**
 * 存储localStorage
 */
const setStore = (name, content) => {
  if (!name) return;
  if (typeof content !== "string") {
    content = JSON.stringify(content);
  }
  window.sessionStorage.setItem(name, content);
};
/**
 * 获取localStorage
 */
const getStore = (name) => {
  if (!name) return;
  return window.localStorage.getItem(name);
};

/**
 * 删除localStorage
 */
const removeStore = (name) => {
  if (!name) return;
  window.localStorage.removeItem(name);
};

/**
 * 设置cookie
 **/
function setCookie(name, value, day) {
  let date = new Date();
  date.setDate(date.getDate() + day);
  document.cookie = name + "=" + value + ";expires=" + date;
}

/**
 * 获取cookie
 **/
function getCookie(name) {
  let reg = RegExp(name + "=([^;]+)");
  let arr = document.cookie.match(reg);
  if (arr) {
    return arr[1];
  } else {
    return "";
  }
}
/**
 * 删除cookie
 **/
function delCookie(name) {
  setCookie(name, null, -1);
}
/**
 * 时间戳
 * @param {*} timestamp  时间戳
 * @param {*} type  返回格式
 */
const timestampToTime = (timestamp, type = 0) => {
  let date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + "-";
  let M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  let D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
  let h =
    (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  let m =
    (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
    ":";
  let s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  if (type === 0) return Y + M + D + h + m + s;
  else if (type === 1) return Y + M + D;
  else if (type === 2) return M + D;
  else if (type === 3) return D;
};

/**
 * 一维数组遍历成树
 * @param {*} data  一维数组
 * @param {*} parentcode  父级唯一标识
 **/
function filterArray(data, parentcode) {
  var tree = [];
  var temp;
  for (var i = 0; i < data.length; i++) {
    if (parseInt(data[i].parentcode) === parseInt(parentcode)) {
      var obj = data[i];
      temp = filterArray(data, data[i].orgcode);
      if (temp.length > 0) {
        obj.children = temp;
      }
      tree.push(obj);
    }
  }
  return tree;
}
/**
 * 防抖函数
 * @param {Function} func  需要防抖的函数
 * @param {Number} wait  时间
 */
const debounce = (func, wait) => {
  // console.log("inininin")
  let timeout;
  return function () {
    let context = this;
    let args = arguments;
    console.log("arguments", arguments);
    if (timeout) clearTimeout(timeout);
    let callNow = !timeout;
    timeout = setTimeout(() => {
      timeout = null;
    }, wait);

    if (callNow) func.apply(context, args);
  };
};
/**
 * 一维/多维数组中根据id获取树型结构的对象
 * @param {*} data  一维/多维数组
 * @param {*} id  需要查找的id
 **/
function getArrayObj(data, id) {
  for (var i in data) {
    if (data[i].orgCode === id) {
      //获取到之后的操作
      return [data[i].longitude, data[i].latitude];
    } else {
      getArrayObj(data[i].children, id);
    }
  }
}

/**
 *  获取Url参数，返回一个对象
 *  例:?a=1&b=2&c=3 ==> {a: "1", b: "2", c: "3"}
 **/
function GetUrlParam() {
  let url = document.location.toString();
  let arrObj = url.split("?");
  let params = Object.create(null);
  if (arrObj.length > 1) {
    arrObj = arrObj[1].split("&");
    arrObj.forEach((item) => {
      item = item.split("=");
      params[item[0]] = item[1];
    });
  }
  return params;
}
/**
 *  超出规定长度补...
 *  @param {*} value  字符串
 *  @param {*} num    最大长度
 **/
function ellipsis(value, num) {
  if (!value) return "";
  if (value.length > num) {
    return value.slice(0, num) + "...";
  }
  return value;
}
/**
 * 表格同值合并
 * @param {String} text 要合并的列的数据
 * @param {Array} array 表格数据
 * @param {String} 要合并的列名
 */
const temp = {}; // 当前重复的值,支持多列
const mergeCellKey = (text, array, columns) => {
  let i = 0;
  if (text !== temp[columns]) {
    temp[columns] = text;
    array.forEach((item) => {
      if (item[columns] === temp[columns]) {
        i += 1;
      }
    });
  }
  return i;
};
/**
 * 获取某个对象数组某一项的和
 **/
function getArrayObjAdd(data, objName) {
  let sum = 0;
  for (var i in data) {
    sum += parseInt(data[i][objName]);
  }
  return sum;
}
/**
 * 获取某个对象数组某一项的和
 * @param {Array} data 对象数组
 * @param {String} arrName 数组名
 * @param {String} objName 要求和的属性名
 **/
const getArrayObjAdd2 = (data, arrName, objName) => {
  let sum = 0;
  for (var i in data) {
    // console.log("data[i]",data[i])
    if (data[i][arrName].length) {
      // console.log("data[i][arrName].length",data[i][arrName])
      for (var j in data[i][arrName]) {
        sum += parseInt(data[i][arrName][j][objName]);
      }
    }
  }
  return sum;
};
/**
 * 获取某个对象数组比率
 **/
function getArrayObjRate(data, arrName) {
  if (!data.length) {
    return 0;
  }
  let sum = 0;
  for (var i in data) {
    sum += parseFloat(data[i][arrName]);
  }
  let rate = Math.round((sum / data.length) * 100) / 100;
  rate = rate.toFixed(2);
  return rate;
}
/**
 * 获取这个节点的父级及祖先节点
 **/
function findAllParent(node, tree, parentNodes = [], index = 0) {
  if (!node || node.parentId === 0) {
    return;
  }
  findParent(node, parentNodes, tree);
  let parentNode = parentNodes[index];
  findAllParent(parentNode, tree, parentNodes, ++index);
  return parentNodes;
}
function findParent(node, parentNodes, tree) {
  for (let i = 0; i < tree.length; i++) {
    let item = tree[i];
    if (item.buildingId === node.parentId) {
      parentNodes.push(item);
      return;
    }
    if (item.children && item.children.length > 0) {
      findParent(node, parentNodes, item.children);
    }
  }
}
//获取浏览器
function getBrowse() {
  let browser = {};
  let userAgent = navigator.userAgent.toLowerCase();
  let s;
  (s = userAgent.match(/msie ([\d.]+)/))
    ? (browser.ie = s[1])
    : (s = userAgent.match(/firefox\/([\d.]+)/))
    ? (browser.firefox = s[1])
    : (s = userAgent.match(/chrome\/([\d.]+)/))
    ? (browser.chrome = s[1])
    : (s = userAgent.match(/opera.([\d.]+)/))
    ? (browser.opera = s[1])
    : (s = userAgent.match(/version\/([\d.]+).*safari/))
    ? (browser.safari = s[1])
    : 0;
  let version = "";
  if (browser.ie) {
    version = "IE " + browser.ie;
  } else {
    if (browser.firefox) {
      version = "Firefox";
    } else {
      if (browser.chrome) {
        version = "Chrome";
      } else {
        if (browser.opera) {
          version = "Opera";
        } else {
          if (browser.safari) {
            version = "Safari";
          } else {
            version = "未知浏览器";
          }
        }
      }
    }
  }
  return version;
}
//根据传入的时间获取周次数组
function getWeekInTime(time) {
  if (time) {
    let startDate = moment(time)
      .startOf("week")
      .format("YYYY-MM-DD");
    var arrDate = [];
    for (var i = 0; i < 7; i++) {
      arrDate.push(addDate(new Date(startDate), i));
    }
    return arrDate;
  } else {
    let startDate = moment(new Date())
      .startOf("week")
      .format("YYYY-MM-DD");
    var arrDate1 = [];
    for (var j = 0; j < 7; j++) {
      arrDate1.push(addDate(new Date(startDate), j));
    }
    return arrDate1;
  }
}
//增加天数
function addDate(date, days) {
  var d = new Date(date);
  d.setDate(d.getDate() + days);
  var m = d.getMonth() + 1;
  return m + "-" + d.getDate();
}

//将编码转换成字符
function utf8ToChar(str) {
  var iCode, iCode1, iCode2;
  iCode = parseInt("0x" + str.substr(1, 2));
  iCode1 = parseInt("0x" + str.substr(4, 2));
  iCode2 = parseInt("0x" + str.substr(7, 2));
  return String.fromCharCode(
    ((iCode & 0x0f) << 12) | ((iCode1 & 0x3f) << 6) | (iCode2 & 0x3f)
  );
}
function getCharFromUtf8(str) {
  var cstr = "";
  var nOffset = 0;
  if (str === "") {
    return "";
  }
  str = str.toLowerCase();
  nOffset = str.indexOf("%e");
  if (nOffset === -1) {
    return str;
  }
  while (nOffset !== -1) {
    cstr += str.substr(0, nOffset);
    str = str.substr(nOffset, str.length - nOffset);
    if (str === "" || str.length < 9) {
      return cstr;
    }
    cstr += utf8ToChar(str.substr(0, 9));
    str = str.substr(9, str.length - 9);
    nOffset = str.indexOf("%e");
  }
  return cstr + str;
}
/**
 * 下载文件
 * @param {*} res
 * @param {String} type 可为空，值为1表示获取自定义
 * @param {Function} fail 错误回调
 */
function downloadFile(res, type, failMess) {
  let BLOB = new Blob([res.blob], {
    type: "application/vnd.ms-excel"
  });

  let fileName = "";
  if (type) {
    // 判断resut为true和code为200
    let cnt = res.headers["content-disposition"].split(";")[1].split("=")[1];
    let newCnt = decodeURIComponent(cnt).replace(/^\"|\"$/g, "");
    newCnt = JSON.parse(newCnt);
    console.log("newCtn", newCnt);
    if (newCnt.code === "200" && newCnt.result) {
      fileName = newCnt.data.filename || "";
    } else {
      failMess(newCnt.message);
    }
  } else {
    fileName = res.headers["content-disposition"].split(";")[1].split("=")[1];
    fileName = getCharFromUtf8(fileName);
  }
  if (!fileName) {
    return false;
  }
  var link = document.createElement("a");
  link.href = window.URL.createObjectURL(BLOB);
  console.log("link.href", link);
  link.download = fileName;

  const uA = window.navigator.userAgent;
  const isIE =
    /msie\s|trident\/|edge\//i.test(uA) &&
    !!(
      "uniqueID" in document ||
      "documentMode" in document ||
      "ActiveXObject" in window ||
      "MSInputMethodContext" in window
    );
  // console.log("isIE", isIE);
  if (isIE) {
    navigator.msSaveBlob(new Blob([res.blob]), fileName);
  } else {
    link.click();
    window.URL.revokeObjectURL(link.href);
  }
}

/*
**
* 图片大批量压缩及上传方法函数
* @param { Blooean } params.isOnly 是否是单张图片处理
* @param { Number } params.reqLen 单次请求文件的数量
* @param { Array } params.files 待上传图片 
* @param { String } params.inputId 文件输入框 documnt.getElementById("upload")
* @param { Number } params.width 压缩后的文件宽
* @param { Number } params.height 压缩后的文件高
* @param { Function } success 压缩成功回调函数
* @param { Function } fail 压缩失败回调函数
*/
export const fileUpload = function (params, success, fail) {
  let { isOnly, reqLen, files, inputId, width, height } = params

  /**
   * 图片转base64
   * @param {*} file 图片文件
   */
  const handleImg = (file) => {
    let data = {
      "imgBase64": '',
      "imgName": file.name
    };
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function (e) {
        var img = new Image();
        img.onload = function () {
          let _this = this;
          let canvas = document.createElement('canvas');
          let context = canvas.getContext('2d');
          canvas.width = width;
          canvas.height = height;
          context.drawImage(_this, 0, 0, width, height);
          data.imgBase64 = canvas.toDataURL('image/jpeg');
          console.log(data.imgName)
          resolve(data)
        };
        img.src = e.target.result;
      };
    })
  }
  if (isOnly) {
    // 单张处理
    handleImg(files[0]).then(data => {
      if (data.imgBase64) {
        success([data])
      } else {
        fail()
      }
    })
  } else {
    // 批量处理
    if (reqLen) {
      // 单次请求数量不得超过20
      if (reqLen > 20) {
        alert('设置单次请求数不得超过20，请修改');
        return;
      }
    } else {
      reqLen = 10;
    }
    /**
     * all 总文件长度
     * num 应请求次数
     * pro 每次请求增加数
     */
    let all = files.length; let num = 0;
    all < reqLen || all === reqLen ? num = 1 : num = Math.ceil(all / reqLen);
    // 图片处理
    let imgData = [];
    let realNum = 0
    // console.log("tup", all, num)
    for (let i = 0; i < all; i++) {
      let file = files[i];

      // 判断文件格式
      let fileFormat = getFileSuffix(files[i].name)
      if (fileFormat !== "jpg" && fileFormat !== 'JPG') {
        message.warning(`暂不支持${fileFormat}格式，请上传jpg/JPG格式`);
        // 清空上传输入框内容
        // console.log(inputId)
        inputId.value = "";
        return;
      }
      try {
        handleImg(file).then((data) => {
          if (data.imgBase64) {
            realNum++
            imgData.push(data);
            // console.log(imgData);
            const fun = (imgData) => {
              if (valueType(success) === 'function') {
                success(imgData, num);
              } else {
                alert('必须为方法函数')
              }
            }
            console.log("判断", all, i, num, imgData.length, reqLen, realNum)
            if (imgData.length === reqLen) {
              // 处理的图片数组等于每批次上传数量
              fun(imgData);
              imgData = [];
            } else if (realNum === all) {
              // 处理完成最后一张图片,排序为乱序
              fun(imgData);
              imgData = [];
            } else if (num === 1) {
              // 只有一张
              if (imgData.length === all) {
                fun(imgData);
              }
            }
          } else {
            fail();
          }
        })
      } catch (e) {
        console.log("处理图片错误")
        fail();
      }
    }
  }
}


/**
 * 导出
 **/
export {
  //存储类
  setStore, //存储localStorage
  getStore, //获取localStorage
  removeStore, //删除localStorage
  setCookie, //设置cookie
  getCookie, //获取cookie
  delCookie, //删除cookie
  getBrowse, //获取浏览器名字
  //操作数据类
  timestampToTime, //时间戳
  filterArray, //一维数组遍历成树
  debounce, //防抖函数
  getArrayObj, //一维/多维数组中根据id获取对象/属性
  GetUrlParam, //获取Url参数，返回一个对象
  ellipsis, //字符串超出最大长度补‘...’
  mergeCellKey, //表格同值合并
  getArrayObjAdd2, //获取某个对象数组某一项的和
  getArrayObjAdd, //获取某个对象数组某一项的和（常用）
  getArrayObjRate, //获取某个对象数组比率
  findAllParent, //树形结构获取这个节点的父级及祖先节点
  getWeekInTime, //传入时间获取周次列表
  downloadFile,
  getCharFromUtf8,
  utf8ToChar,
  tablePages // 跳转到上一页
};

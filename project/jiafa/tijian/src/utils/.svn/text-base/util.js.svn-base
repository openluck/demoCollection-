import CryptoJS from 'crypto-js'

/**
   * 存储localStorage
   */
  const setStore = (name, content) => {
    if (!name) return;
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    window.sessionStorage.setItem(name, content);
  }
  /**
   * 获取localStorage
   */
  const getStore = name => {
    if (!name) return;
    return window.localStorage.getItem(name);
  }
  
  /**
  * 删除localStorage
  */
  const removeStore = name => {
    if (!name) return;
    window.localStorage.removeItem(name);
  }
  
  /**
  * 设置cookie
  **/
  function setCookie(name, value, day) {
    let date = new Date();
    date.setDate(date.getDate() + day);
    document.cookie = name + '=' + value + ';expires=' + date;
  }
  
  /**
  * 获取cookie
  **/
  function getCookie(name) {
    let reg = RegExp(name + '=([^;]+)');
    let arr = document.cookie.match(reg);
    if (arr) {
        return arr[1];
    } else {
        return '';
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
   * @param {*} type  返回格式(不传默认为0)
   * 例:155488496544 ==> 2020-10-27
   */
  const timestampToTime = (timestamp, type = 0) => {
    let date = new Date(timestamp) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + '-'
    let M =
        (date.getMonth() + 1 < 10
            ? '0' + (date.getMonth() + 1)
            : date.getMonth() + 1) + '-'
    let D =
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
    let h =
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
    let m =
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
        ':'
    let s =
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    if (type === 0) return Y + M + D + h + m + s
    else if (type === 1) return Y + M + D
    else if (type === 2) return M + D
    else if (type === 3) return D
  };
  
  /**
   * 一维数组遍历成树
   * @param {*} data  一维数组
   * @param {*} parentcode  父级唯一标识
   * 例：常用场景 ==> 机构树 地址树
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
    return function() {
        let context = this;
        let args = arguments;
        console.log("arguments", arguments)
        if (timeout) clearTimeout(timeout);
        let callNow = !timeout;
        timeout = setTimeout(() => {
            timeout = null;
        }, wait)
  
        if (callNow) func.apply(context, args)
    }
  }
  /**
   * 一维/多维数组中根据id获取树型结构的对象
   * @param {*} data  一维/多维数组
   * @param {*} id  需要查找的id
   * 例：常用场景==> 树形结构去查找某个节点对象
   **/
  function getArrayObj(data, id) {
    for (var i in data) {
        if (data[i].orgCode === id) {
          //获取到之后的操作
          console.log(data[i])
          return data[i]
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
    let params = Object.create(null)
    if (arrObj.length > 1) {
       arrObj = arrObj[1].split("&");
       arrObj.forEach(item => {
          item = item.split("=");
          params[item[0]] = item[1]
       })
    }
    return params;
  }
  /**
   *  超出规定长度补...
   *  @param {*} value  字符串
   *  @param {*} num    最大长度
   *  例:'这是一段很长很长很长很长很长很长很长很长的文本' ==> '这是一段...'
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
   * 例：表头相同时合并
   */
  const temp = {} // 当前重复的值,支持多列
  const mergeCellKey = (text, array, columns) => {
      let i = 0
      if (text !== temp[columns]) {
          temp[columns] = text
          array.forEach((item) => {
              if (item[columns] === temp[columns]) {
                  i += 1
              }
          })
      }
      return i
  }
  /**
   * 获取某个对象数组某一项的和
   * 例：data=[{name:'zhangsan',age:'18'},{name:'lisi',age:'12'}] ,objName=age
   * 输出:==>30
   **/
  function getArrayObjAdd(data, objName) {
    let sum = 0
    for (var i in data) {
        sum += parseInt(data[i][objName])
    }
    return sum
  }
  /**
   * 获取某个对象数组某一项的和
   * @param {Array} data 对象数组
   * @param {String} arrName 数组名
   * @param {String} objName 要求和的属性名
   * 例:同上数组1内还有数组2，数组2中是对象数组求和
   **/
  const getArrayObjAdd2 = (data, arrName, objName) => {
    let sum = 0
    for (var i in data) {
        // console.log("data[i]",data[i])
        if (data[i][arrName].length) {
            // console.log("data[i][arrName].length",data[i][arrName])
            for (var j in data[i][arrName]) {
                sum += parseInt(data[i][arrName][j][objName])
            }
        }
    }
    return sum
  }
  /**
   * 获取某个对象数组比率
   * 例：data=[{name:'zhangsan',age:'18'},{name:'lisi',age:'12'}] ,arrName=age
   * 输出==>18/(18+12)
   **/
  function getArrayObjRate(data, arrName) {
    if (!data.length) {
        return 0;
    }
    let sum = 0
    for (var i in data) {
        sum += parseFloat(data[i][arrName])
    }
    let rate = Math.round((sum / data.length) * 100) / 100;
    rate = rate.toFixed(2)
    return rate
  }
  /**
   * 获取这个节点的父级及祖先节点
   * node：节点对象 
   * tree：树形数组
   * 例：树形结构（全国的树形结构，知道成都市的对象，返回全国，四川省的对象数组）
   **/
  function findAllParent(node, tree, parentNodes = [], index = 0) {
    if (!node || node.parentCode === 0) {
        return
    }
    findParent(node, parentNodes, tree)
    let parentNode = parentNodes[index]
    findAllParent(parentNode, tree, parentNodes, ++index)
    return parentNodes
  }
  function findParent(node, parentNodes, tree) {
    for (let i = 0; i < tree.length; i++) {
        let item = tree[i]
        if (item.orgCode === node.parentCode) {
            parentNodes.push(item)
            return
        }
        if (item.children && item.children.length > 0) {
            findParent(node, parentNodes, item.children)
        }
    }
  }

//加密
const encrypt = (word, keyStr) => { 
  keyStr = keyStr || 'C599B38D346BB2C2';
  var key = CryptoJS.enc.Utf8.parse(keyStr);//Latin1 w8m31+Yy/Nw6thPsMpO5fg==
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
  return encrypted.ciphertext.toString();
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
//下载文件
function downloadFile(res) {
  let BLOB = new Blob([res.blob], {
    type: "application/vnd.ms-excel",
  });
  let fileName = res.headers["content-disposition"].split(';')[1].split('=')[1]
  fileName = getCharFromUtf8(fileName)
  // console.log(fileName)

  var link = document.createElement("a");
  link.href = window.URL.createObjectURL(BLOB);
  console.log("link.href", link)
  link.download = fileName;

  const uA = window.navigator.userAgent
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
    navigator.msSaveBlob(new Blob([res.blob]), fileName)
  } else {
    link.click()
    window.URL.revokeObjectURL(link.href);
  }
}

// 获取查询参数
const getQueryString = (name) => {
  // if (name === "token" && sessionStorage.sjgdxgxt_token) {
  //   return sessionStorage.sjgdxgxt_token
  // }
  name = name.toLowerCase()
  // let href = 'index.html?token=Q0ZGMTFEQ0IzRTIxNDQ1M0E3MTdGQTlCOEREQkE4RTY=.MjAyMC0wNC0yMSAxOToyMzo1Nw==.EAFAF931345DF5CBBCC8115BA37B9904&orgcode=86.45&server=http://10.10.1.183:8080/jf_exwsp/'
  let href = window.location.href
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  let w = href.slice(href.indexOf('?'))
  let r = w.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
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
    encrypt, //AES 加密
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
    getCharFromUtf8, //???
    downloadFile,
    getQueryString
}
/**
 * 时间戳
 * @param {*} timestamp  时间戳
 */
const timestampToTime = (timestamp, type = 0) => {
  let date = new Date(timestamp) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + '-'
  let M =
    (date.getMonth() + 1 < 10 ?
      '0' + (date.getMonth() + 1) :
      date.getMonth() + 1) + '-'
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
  return window.sessionStorage.getItem(name);
}

/**
 * 删除localStorage
 */
const removeStore = name => {
  if (!name) return;
  window.sessionStorage.removeItem(name);
}

/**
 * 设置cookie
 **/
function setCookie(name, value, day) {
  let date = new Date();
  date.setDate(date.getDate() + day);
  document.cookie = name + '=' + value + ';expires=' + date;
};

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
};

/**
 * 删除cookie
 **/
function delCookie(name) {
  setCookie(name, null, -1);
};

const getQueryString = name => {
  // if (name === "token" && sessionStorage.getItem('token')) {
  //     return sessionStorage.getItem('token')
  // }
  name = name.toLowerCase()
  let href = window.location.search
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  let w = href.slice(href.indexOf("?"));
  let r = w.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
};
/**
 * 一维数组遍历成树
 **/
let curindex = -1;
function filterArray(data, parentCode) {
  var tree = [];
  var temp;
  // debugger
  // console.log("data, parentCode", parentCode,curindex);
  for (var i = 0; i < data.length; i++) {
    if (data[i].parentCode == parentCode && i != curindex) {
      var obj = data[i];
      curindex = i
      temp = filterArray(data, data[i].orgCode);
      if (temp.length > 0) {
        obj.children = temp;
      }
      // console.log(obj)
      tree.push(obj);
    }
  }
  // console.log(tree)
  return tree;
};

/**
 * 获取这个节点的父级及祖先节点
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
/**
 * 根据id获取树型结构的对象
 **/
function getArrayObj(data, id) {
  for (var i in data) {
    // console.log('i',data[i].orgCode,i);
    if (data[i].orgCode == id) {
      // console.log('datai',data[i]);    
      return [data[i].longitude, data[i].latitude]
      // } else {
      //     getArrayObj(data[i].children, id);
    }
  }
}


//命名调整
function getArrayObj1(data, id) {
  return data.find(org => org.orgCode === id);
}

/**
 * 根据orgcode（去点转数）对树进行排序，值越小排序在上
 **/
function _sort(data) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].children) {
      _sort(data[i].children)
    }
  }
  data.sort(function (a, b) {
    let tempa = parseInt(a.orgCode.replace(/\./g, ''))
    let tempb = parseInt(b.orgCode.replace(/\./g, ''))
    return tempa - tempb
  })

}
//获取浏览器
function getBrowse() {
  let browser = {}
  let userAgent = navigator.userAgent.toLowerCase()
  let s
    ; (s = userAgent.match(/msie ([\d.]+)/))
      ? (browser.ie = s[1])
      : (s = userAgent.match(/firefox\/([\d.]+)/))
        ? (browser.firefox = s[1])
        : (s = userAgent.match(/chrome\/([\d.]+)/))
          ? (browser.chrome = s[1])
          : (s = userAgent.match(/opera.([\d.]+)/))
            ? (browser.opera = s[1])
            : (s = userAgent.match(/version\/([\d.]+).*safari/))
              ? (browser.safari = s[1])
              : 0
  let version = ""
  if (browser.ie) {
    version = "IE " + browser.ie
  } else {
    if (browser.firefox) {
      version = "Firefox"
    } else {
      if (browser.chrome) {
        version = "Chrome"
      } else {
        if (browser.opera) {
          version = "Opera"
        } else {
          if (browser.safari) {
            version = "Safari"
          } else {
            version = "未知浏览器"
          }
        }
      }
    }
  }
  return version
}



/**
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
function debounce(func, wait, immediate) {
  let timeout;

  return function () {
    let context = this;
    let args = arguments;

    if (timeout) clearTimeout(timeout);
    if (immediate) {
      var callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait)
      if (callNow) func.apply(context, args)
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args)
      }, wait);
    }
  }()
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
// console.log("6666", getCharFromUtf8("UTF-8''2020%E5%B9%B4%E5%9C%B0%E5%8C%BA%E9%A2%86%E5%8D%B7%E6%B8%85%E5%8D%95%E6%A8%A1%E6%9D%BF%EF%BC%88%E6%99%AE%E9%80%9A%EF%BC%89.docx"));
//下载导出文件
function downloadFile(res, fileName = null) {
  console.log("res", res);
  let BLOB = new Blob([res.data], {
    type: "application/x-msdownload",
  });
  var link = document.createElement("a");
  link.href = window.URL.createObjectURL(BLOB);
  console.log("link.href", link)
  try {
    if (fileName === null) {
      const arr = res.headers["content-disposition"].split(';')
      let str = arr[arr.length - 1].split('=')[1]
      // let fileName = res.headers["content-disposition"].split(';')[1].split('=')[1]
      str = str.replace("UTF-8''", "")
      fileName = getCharFromUtf8(str)
    }
    link.download = fileName;

  } catch (error) {

  }


  // link.download = fileName;

  const uA = window.navigator.userAgent
  const isIE =
    /msie\s|trident\/|edge\//i.test(uA) &&
    !!(
      "uniqueID" in document ||
      "documentMode" in document ||
      "ActiveXObject" in window ||
      "MSInputMethodContext" in window
    );
  console.log("isIE", isIE);
  if (isIE) {
    navigator.msSaveBlob(new Blob([res.blob]), fileName)
  } else {
    link.click()
    window.URL.revokeObjectURL(link.href);
  }
}

//使用iframe框架下载文件
const downloadUrl = url => {
  var a = document.createElement('a');
  a.style.display = "none";
  a.setAttribute("download", "filename");
  a.setAttribute("href", url);
  document.body.appendChild(a);
  console.log(a);
  a.click();
  // var iframe = document.createElement('iframe')
  // iframe.style.display = 'none' // 防止影响页面
  // iframe.style.height = 0 // 防止影响页面
  // iframe.src = url
  // document.body.appendChild(iframe) // 这一行必须，iframe挂在到dom树上才会发请求
  // console.log(iframe)
  // // 5分钟之后删除（onload方法对于下载链接不起作用，就先抠脚一下吧）
  // setTimeout(() => {
  //   iframe.remove()
  // }, 5000)
}

const Base64 = {
  // private property
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

  // public method for encoding
  encode: function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    input = Base64._utf8_encode(input);

    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output =
        output +
        this._keyStr.charAt(enc1) +
        this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) +
        this._keyStr.charAt(enc4);
    }

    return output;
  },

  // public method for decoding
  decode: function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {
      enc1 = this._keyStr.indexOf(input.charAt(i++));
      enc2 = this._keyStr.indexOf(input.charAt(i++));
      enc3 = this._keyStr.indexOf(input.charAt(i++));
      enc4 = this._keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }

    output = Base64._utf8_decode(output);

    return output;
  },

  // private method for UTF-8 encoding
  _utf8_encode: function (string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }

    return utftext;
  },

  // private method for UTF-8 decoding
  _utf8_decode: function (utftext) {
    var string = "";
    var i = 0;
    var c = (c1 = c2 = 0);

    while (i < utftext.length) {
      c = utftext.charCodeAt(i);

      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if (c > 191 && c < 224) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(
          ((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
        );
        i += 3;
      }
    }

    return string;
  },
};

/**
 * 导出 
 **/
export {
  filterArray,
  timestampToTime,
  setStore,
  getStore,
  removeStore,
  setCookie,
  getCookie,
  delCookie,
  getQueryString,
  findParent,
  getArrayObj,
  findAllParent,
  _sort,
  getArrayObj1,
  getBrowse,
  debounce, downloadFile, downloadUrl, Base64
}
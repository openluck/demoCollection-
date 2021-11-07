// import uuid from 'node-uuid'
import { Tree } from 'antd'
import Teaching from './../../../components/teaching'
import moment from "moment";
const { TreeNode } = Tree

// 自动告警检查遍历场所树
export const zdPlaceMap = data => {
  if (data.childList && data.childList[0]) {
    return (
      <TreeNode key={data.id} value={data.id} title={data.name}>
        {
          data.childList.map(item => {
            return zdPlaceMap(item)
          })
        }
      </TreeNode>
    )
  } else {
    return <TreeNode key={data.id} value={data.id} title={data.name} />
  }
}
// 遍历场所树
export const placeMap = data => {
  if (data.childList && data.childList[0]) {
    return (
      <TreeNode key={data.key} title={data.name}>
        {
          data.childList.map(item => {
            return placeMap(item)
          })
        }
      </TreeNode>
    )
  } else {
    // return <TreeNode key={data.key} value={data.key} title={<Teaching title={data.name} isLive={1} />} />
    return <TreeNode key={data.key} title={data.name} />
  }
}
export const tourMap = (data, type) => {
  if (data.childList && data.childList[0]) {
    data.id = data.id + ' ' + 'A'
    data.key = data.id
    data.childList.map(item => {
      return tourMap(item, type)
    })
    return data
  } else {
    data.key = data.id
    return data
  }
}
// 获取当前日期
export function getDate(params) {
  var date
  if (params) {
    date = new Date(params);
  } else {
    date = new Date();
  }
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}
export function toHHmmss() {
  var now = new Date();
  var yy = now.getFullYear();      //年
  var mm = now.getMonth() + 1;     //月
  var dd = now.getDate();          //日
  var hh = now.getHours();         //时
  var ii = now.getMinutes();       //分
  var ss = now.getSeconds();       //秒
  var clock = yy + "-";
  if (mm < 10) clock += "0";
  clock += mm + "-";
  if (dd < 10) clock += "0";
  clock += dd + " ";
  if (hh < 10) clock += "0";
  clock += hh + ":";
  if (ii < 10) clock += '0';
  clock += ii + ":";
  if (ss < 10) clock += '0';
  clock += ss;
  return clock;
}

export function toHHmmss2(time) {
  time = new Date(time)
  var yy = time.getFullYear();      //年
  var mm = time.getMonth() + 1;     //月
  var dd = time.getDate();          //日
  var hh = time.getHours();         //时
  var ii = time.getMinutes();       //分
  var ss = time.getSeconds();       //秒
  var clock = yy + "-";
  if (mm < 10) clock += "0";
  clock += mm + "-";
  if (dd < 10) clock += "0";
  clock += dd + " ";
  if (hh < 10) clock += "0";
  clock += hh + ":";
  if (ii < 10) clock += '0';
  clock += ii + ":";
  if (ss < 10) clock += '0';
  clock += ss;
  return clock;
}

export function timeTransform(time) {
  const h = parseInt(time.substr(0, 2))
  const m = parseInt(time.substr(3, 2))
  const s = parseInt(time.substr(6, 2))
  return h * 60 * 60 + m * 60 + s
}

function image2Base64(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, img.width, img.height);
  var dataURL = canvas.toDataURL("image/png");
  return dataURL;
}

export function getImgBase64(src) {
  return new Promise((resolve, reject) => {
    var base64 = "";
    var img = new Image();
    img.src = src;
    img.onload = function () {
      base64 = image2Base64(img);
      // alert(base64);
      resolve(base64)
    }
  })
}

export function animate(obj, data, time, fn) {//运动对象，运动数据，[运动时间]，[回调函数]
  //保存初始值和变化值
  var start = {};
  var dis = {};

  for (var name in data) {
    //获取样式，根据属性名保存在json中，{width:200,height:200}
    start[name] = parseFloat((obj.currentStyle || getComputedStyle(obj, null))[name]);
    //变化值 = 目标值 - 初始值  ----> {width:500,height:300}
    dis[name] = data[name] - start[name];
  }

  //根据完成的时间获得运动次数，30为定时器频率
  var count = Math.round((time || 700) / 30);

  //记录已经运动次数
  var n = 0;
  //将定时器绑定在对象身上，如果不同对象调用不会清除之前的运动
  clearInterval(obj.timer);
  obj.timer = setInterval(function () {

    n++;
    for (var name in data) {
      //位置:起点 + 距离/次数*n        
      var cur = start[name] + dis[name] / count * n;

      //对特殊属性进行判断
      if (name == "opacity") {
        obj.style.opacity = cur;
        obj.style.filter = "alpha(opacity:" + cur * 100 + ")";
      } else {
        obj.style[name] = cur + "px";
      }
    }

    //如果已经运动次数和总次数相等，则完成运动，清除定时器，执行回调函数
    if (n == count) {
      clearInterval(obj.timer);
      fn && fn.call(obj);
    }

  }, 30);
}

export const getClassroomId = (data, list) => {
  if (data.childList && data.childList[0]) {
    return getClassroomId(data.childList[0], [...list, data.key])
  } else {
    return { classRoomId: data.key, expandedKeys: [...list, data.key] }
  }
}

export function dateToss (date) {
  return new Date(date).getTime()
}

export const JudgeRgArrage = () => {
  let rgArrangeFlag = sessionStorage.getItem('paArrangeFlag')
  console.log('rgArrangeFlag', rgArrangeFlag)
  if (rgArrangeFlag) {
    rgArrangeFlag = JSON.parse(rgArrangeFlag)
    if (rgArrangeFlag) {
      return true
    } else {
      return false
    }
  }
  return false
}


export const isIE = () => {
  let activeXObject = false
  let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串 
  let isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
  if (isIE11) {
    activeXObject = true
  }
  return activeXObject;
}
/* vlc安装判断 */
export const isInstalledVlc = () => {
  let vlcObj = null;
  try {
    vlcObj = new ActiveXObject("VideoLAN.Vlcplugin.2");
    if (vlcObj != null) {
      return true
    }
  } catch (e) {
    return false
  }
}
export const disabledEndDate = (endValue) => {
  const tody = moment(getDate())
  let flag = endValue.valueOf() > tody.valueOf()
  return flag
}


export const doGo = (targetURL) => {
  var vlc = document.querySelector("#vlc");
  console.log('vlc', vlc)
  if (vlc) {
    vlc.playlist.items.clear();
    var options = [":rtsp-tcp"];
    var itemId = vlc.playlist.add(targetURL, "", options);
    console.log('itemId', itemId)
    if (itemId != -1) {
      // play MRL
      vlc.playlist.playItem(itemId);
    }
    else {
      alert("cannot play at the moment !");
    }
    // doItemCount();
  }
}
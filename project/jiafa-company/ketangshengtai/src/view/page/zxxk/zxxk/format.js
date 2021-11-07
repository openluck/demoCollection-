import { Tree } from "antd";
import Teaching from "./../../../components/teaching";
import moment from "moment";
import uuid from "node-uuid";
const { TreeNode } = Tree;

// 遍历场所树
export const tourMap = (data, type) => {
  if (data.children && data.children[0]) {
    data.id = data.id + uuid.v1() + " " + "A";
    data.key = data.id;
    data.children.map((item) => {
      return tourMap(item, type);
    });
    return data;
  } else {
    data.id = data.id + (type != 1 ? "/" + uuid.v1() : "");
    data.key = data.id;
    return data;
  }
};

export const placeMap = (data, type) => {
  if (data.children && data.children[0]) {
    return (
      <TreeNode key={data.key} title={data.name}>
        {data.children.map((item) => {
          return placeMap(item, type);
        })}
      </TreeNode>
    );
  } else {
    return (
      <TreeNode
        disabled={data.isLive === 0}
        key={data.key}
        title={<Teaching title={data.name} isLive={data.isLive} />}
      />
    );
  }
};
// 获取当前日期
export function getDate(params) {
  var date;
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

export const formatSecondsToTime = (seconds) => {
  let ss = Math.floor(seconds); // 秒
  let mm = 0; // 分
  let hh = 0; // 小时
  if (ss > 60) {
    mm = Math.floor(ss / 60);
    ss = Math.floor(ss % 60);
  }
  if (mm > 60) {
    hh = Math.floor(mm / 60);
    mm = Math.floor(mm % 60);
  }

  let result = ("00" + Math.floor(ss)).slice(-2);
  if (mm > 0) result = ("00" + Math.floor(mm)).slice(-2) + ":" + result;
  else result = "00:" + result;

  if (hh > 0) result = ("00" + Math.floor(hh)).slice(-2) + ":" + result;
  return result;
};

export const formatTimeToSeconds = (time) => {
  let res = "";
  if (time.length === 5) {
    var min = time.split(":")[0];
    var sec = time.split(":")[1];
    res = Number(min * 60) + Number(sec);
  } else {
    var hour = time.split(":")[0];
    var min = time.split(":")[1];
    var sec = time.split(":")[2];
    res = Number(hour * 3600) + Number(min * 60) + Number(sec);
  }
  return res;
};

export const getClassroomId = (data, list) => {
  if (data.children && data.children[0]) {
    let index = 9999;
    data.children.some((item, idx) => {
      // 可以判断开始的和结束的
      if (item.isLive === 1) {
        index = idx;
        return true;
      }
    });
    if (index === 9999) {
      return getClassroomId(data.children[0], [...list, data.id]);
    } else {
      return { id: data.children[index].id, expandedKeys: [...list, data.id] };
    }
  } else {
    return { id: data.id, expandedKeys: [...list, data.id] };
  }
};

export const JudgeZxArrage = () => {
  let zxArrangeFlag = sessionStorage.getItem("zxArrangeFlag");
  if (zxArrangeFlag) {
    zxArrangeFlag = JSON.parse(zxArrangeFlag);
    if (zxArrangeFlag) {
      return true;
    } else {
      return false;
    }
  }
  return false;
};

export function toHHmmss(time) {
  var now;
  if (time) {
    now = new Date(time);
  } else {
    now = new Date();
  }
  var yy = now.getFullYear(); //年
  var mm = now.getMonth() + 1; //月
  var dd = now.getDate(); //日
  var hh = now.getHours(); //时
  var ii = now.getMinutes(); //分
  var ss = now.getSeconds(); //秒
  var clock = yy + "-";
  if (mm < 10) clock += "0";
  clock += mm + "-";
  if (dd < 10) clock += "0";
  clock += dd + " ";
  if (hh < 10) clock += "0";
  clock += hh + ":";
  if (ii < 10) clock += "0";
  clock += ii + ":";
  if (ss < 10) clock += "0";
  clock += ss;
  return clock;
}

export function animate(obj, data, time, fn) {
  //运动对象，运动数据，[运动时间]，[回调函数]
  //保存初始值和变化值
  var start = {};
  var dis = {};

  for (var name in data) {
    //获取样式，根据属性名保存在json中，{width:200,height:200}
    start[name] = parseFloat(
      (obj.currentStyle || getComputedStyle(obj, null))[name]
    );
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
      var cur = start[name] + (dis[name] / count) * n;

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

export function dateToss(date) {
  return new Date(date).getTime();
}

export const isIE = () => {
  let activeXObject = false;
  let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  // let isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
  // var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
  let isIE11 =
    userAgent.indexOf("Trident") > -1 && userAgent.indexOf("rv:11.0") > -1;
  if (isIE11) {
    activeXObject = true;
  }
  // console.log('activeXObject', userAgent, activeXObject, isIE11, isIE)
  return activeXObject;
};

/* vlc判断 */
export const isInstalledVlc = () => {
  let vlcObj = null;
  try {
    vlcObj = new ActiveXObject("VideoLAN.Vlcplugin.2");
    if (vlcObj != null) {
      return true;
    }
  } catch (e) {
    return false;
  }
};

export const doGo = (targetURL) => {
  var vlc = document.querySelector("#vlc");
  console.log("vlc", vlc);
  if (vlc) {
    vlc.playlist.items.clear();
    var options = [":rtsp-tcp"];
    var itemId = vlc.playlist.add(targetURL, "", options);
    console.log("itemId", itemId);
    if (itemId != -1) {
      // play MRL
      vlc.playlist.playItem(itemId);
    } else {
      alert("cannot play at the moment !");
    }
    // doItemCount();
  }
};

export const disabledEndDate = (endValue) => {
  const tody = moment(getDate());
  // const dateObj = getMomentDate()
  let flag = endValue.valueOf() > tody.valueOf();
  return flag;
};

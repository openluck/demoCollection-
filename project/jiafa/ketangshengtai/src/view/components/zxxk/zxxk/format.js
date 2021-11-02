export function toHHmmss(time) {
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
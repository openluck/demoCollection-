// 引入jwt 一个生成汉验证token的模块
const jwt = require('jsonwebtoken');

// 生成token
const secret = 'hexuehui'; // 密钥，防止篡改
let createToken = function (data, exp) {
  let obj = {};
  obj.data = data ? data : null;
//   obj.type = 'express-jwt';
//   obj.ctime = new Date().getTime(); //token的创建时间
  exp = exp ? exp : 60 * 60 * 24 * 100; //设定的过期时间,不设置就默认1天
  //区别： 用expressJwt要加上Bearer，后面有个空格的，因为源码是这样写的...咋也不敢问为啥这样写啊..
  let token = 'Bearer ' + jwt.sign(obj, secret, { expiresIn: exp });
  return token;
};

module.exports = createToken;
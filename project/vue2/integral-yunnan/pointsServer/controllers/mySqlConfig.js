var mysql = require("mysql");
var config = require("./defaultConfig");

var pool = mysql.createPool({
  host: config.database.HOST,
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE,
  port: config.database.PORT,
});

let allServices = {
  query: function (sql, values) {
    return new Promise((resolve, reject) => {
      pool.getConnection(function (err, connection) {
        if (err) {
          reject(err);
        } else {
          connection.query(sql, values, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows);
            }
            connection.release();
          });
        }
      });
    });
  },
};

/**
 * @name: 会员用户登录
 * @msg:
 * @param {*} username
 * @param {*} userpwd
 * @return {*}
 */
let userLogin = function (username, userpwd) {
  let _sql = `select * from users where username="${username}" and userpwd="${userpwd}";`;
  return allServices.query(_sql);
};

/**
 * @name: 企业员工登录
 * @msg:
 * @param {*}
 * @return {*}
 */
let adminLogin = function (adusername, aduserpwd) {
  let _sql = `select * from adminuser where adusername="${adusername}" and aduserpwd="${aduserpwd}";`;
  return allServices.query(_sql);
};

//  头条新闻
let today = function () {
  let _sql = "select * from news";
  return allServices.query(_sql);
};

// 热点新闻
let hotNews = function () {
  let _sql = "select * from hotnews";
  return allServices.query(_sql);
};

// 个人信息
let userinfo = function (username) {
  let _sql = `select * from userinfo where username="${username}"`;
  return allServices.query(_sql);
};

// 商品
let goods = function () {
  let _sql = "select * from goods";
  return allServices.query(_sql);
};

// 注册vip用户
let insertVipUser = function (values) {
  let _sql = `insert into users set username=?,userpwd=?;`;
  return allServices.query(_sql, values);
};

// 查找vip用户
let findVipUser = function (username) {
  let _sql = `select * from users where username="${username}";`;
  return allServices.query(_sql);
};

// 注册企业用户
let insertAdUser = function (values) {
  let _sql = `insert into adminuser set adusername=?,aduserpwd=?;`;
  return allServices.query(_sql, values);
};

// 查找企业用户
let findAdUser = function (username) {
  let _sql = `select * from adminuser where adusername="${username}";`;
  return allServices.query(_sql);
};

// 积分数
let findPointes = function () {
  let _sql = `select * from publish`;
  return allServices.query(_sql);
}
// 发布积分
let publishPointes = function (remainPointes) {
  // let _sql = `update publish set orgPointes="${orgPointes}",remainPointes="${remainPointes}";`;
  let _sql = `update publish set remainPointes="${remainPointes}";`;
  return allServices.query(_sql);
}
// 获取商品详情
let goodDetails = function (imgId) {
  let _sql = `select * from goods where id="${imgId}";`;
  return allServices.query(_sql);
}
module.exports = {
  userLogin,
  adminLogin,
  today,
  hotNews,
  userinfo,
  goods,
  insertVipUser,
  findVipUser,
  insertAdUser,
  findAdUser,
  findPointes,
  publishPointes,
  goodDetails
};

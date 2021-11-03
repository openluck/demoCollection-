const router = require("koa-router")();
const userService = require("../controllers/mysqlConfig");
const utils = require("../controllers/utils");

router.prefix("/users");

//会员登录
router.post("/userLogin", async (ctx, next) => {
  var _username = ctx.request.body.username;
  var _userpwd = ctx.request.body.userpwd;
  await userService
    .userLogin(_username, _userpwd)
    .then((res) => {
      let r = "";
      console.log(res);
      if (res.length) {
        r = "ok";
        let result = {
          id: res[0].id,
          nickname: res[0].nickname,
          username: res[0].username,
        };
        ctx.body = {
          code: "200",
          data: result,
          mess: "登陆成功",
        };
      } else {
        r = "error";
        ctx.body = {
          code: "400",
          data: r,
          mess: "账号或密码错误",
        };
      }
    })
    .catch((err) => {
      ctx.body = {
        code: "200",
        data: err,
      };
    });
});
// 企业登陆
router.post("/adminLogin", async (ctx, next) => {
  var _adusername = ctx.request.body.adusername;
  var _aduserpwd = ctx.request.body.aduserpwd;
  await userService
    .adminLogin(_adusername, _aduserpwd)
    .then((res) => {
      let r = "";
      if (res.length) {
        r = "ok";
        let result = {
          id: res[0].id,
          adnickname: res[0].adnickname,
          adusername: res[0].adusername,
        };
        ctx.body = {
          code: "200",
          data: result,
          mess: "登陆成功",
        };
      } else {
        r = "error";
        ctx.body = {
          code: "400",
          data: r,
          mess: "账号或密码错误",
        };
      }
    })
    .catch((err) => {
      ctx.body = {
        code: "200",
        data: err,
      };
    });
});
// 头条新闻
router.get("/todayNews", async (ctx, next) => {
  await userService
    .today()
    .then((res) => {
      let r = "";
      if (res.length) {
        r = "ok";
        ctx.body = {
          code: "200",
          data: res,
          mess: "ok",
        };
      } else {
        r = "error";
        ctx.body = {
          code: "400",
          data: r,
          mess: "查询失败",
        };
      }
    })
    .catch((err) => {
      ctx.body = {
        code: "200",
        data: err,
      };
    });
});
// 热点新闻
router.get("/hotNews", async (ctx, next) => {
  await userService
    .hotNews()
    .then((res) => {
      let r = "";
      if (res.length) {
        r = "ok";
        ctx.body = {
          code: "200",
          data: res,
          mess: "ok",
        };
      } else {
        r = "error";
        ctx.body = {
          code: "400",
          data: r,
          mess: "查询失败",
        };
      }
    })
    .catch((err) => {
      ctx.body = {
        code: "200",
        data: err,
      };
    });
});
// 用户信息
router.post("/userinfo", async (ctx, next) => {
  var _username = ctx.request.body.username;
  console.log("_username", _username);
  await userService
    .userinfo(_username)
    .then((res) => {
      let r = "";
      if (res.length) {
        r = "ok";
        ctx.body = {
          code: "200",
          data: res,
          mess: "ok",
        };
      } else {
        r = "error";
        ctx.body = {
          code: "400",
          data: r,
          mess: "查询失败",
        };
      }
    })
    .catch((err) => {
      ctx.body = {
        code: "200",
        data: err,
      };
    });
});
// 商品信息
router.get("/goods", async (ctx, next) => {
  await userService
    .goods()
    .then((res) => {
      let r = "";
      if (res.length) {
        r = "ok";
        ctx.body = {
          code: "200",
          data: res,
          mess: "ok",
        };
      } else {
        r = "error";
        ctx.body = {
          code: "400",
          data: r,
          mess: "查询失败",
        };
      }
    })
    .catch((err) => {
      ctx.body = {
        code: "200",
        data: err,
      };
    });
});
// 注册vip
router.post("/userRegVip", async (ctx, next) => {
  var _username = ctx.request.body.username;
  var _userpwd = ctx.request.body.userpwd;
  if (!_username && !_userpwd) {
    ctx.body = {
      code: "800001",
      mess: "用户名密码昵称不能为空",
    };
    return;
  }
  let user = {
    username: _username,
    userpwd: _userpwd,
  };
  await userService
    .findVipUser(user.username)
    .then(async (res) => {
      if (res.length) {
        try {
          throw Error("用户名已存在");
        } catch (error) {
          console.log(error);
        }
        ctx.body = {
          code: "800003",
          data: "err",
          mess: "用户名已存在",
        };
      } else {
        await userService
          .insertVipUser([user.username, user.userpwd])
          .then((res) => {
            console.log(res);
            let r = "";
            if (res.affectedRows != 0) {
              r = "ok";
              ctx.body = {
                code: "200",
                data: r,
                mess: "注册成功",
              };
            } else {
              r = "error";
              ctx.body = {
                code: "800004",
                data: r,
                mess: "注册失败",
              };
            }
          })
          .catch((err) => {
            ctx.body = {
              code: "800002",
              data: err,
            };
          });
      }
    })
    .catch((err) => {
      ctx.body = {
        code: "800002",
        data: err,
      };
    });
});
// 注册adminvip
router.post("/userRegAdm", async (ctx, next) => {
  var _username = ctx.request.body.username;
  var _userpwd = ctx.request.body.userpwd;
  if (!_username && !_userpwd) {
    ctx.body = {
      code: "800001",
      mess: "用户名密码昵称不能为空",
    };
    return;
  }
  let user = {
    username: _username,
    userpwd: _userpwd,
  };
  await userService
    .findAdUser(user.username)
    .then(async (res) => {
      if (res.length) {
        try {
          throw Error("用户名已存在");
        } catch (error) {
          console.log(error);
        }
        ctx.body = {
          code: "800003",
          data: "err",
          mess: "用户名已存在",
        };
      } else {
        await userService
          .insertAdUser([user.username, user.userpwd])
          .then((res) => {
            console.log(res);
            let r = "";
            if (res.affectedRows != 0) {
              r = "ok";
              ctx.body = {
                code: "200",
                data: r,
                mess: "注册成功",
              };
            } else {
              r = "error";
              ctx.body = {
                code: "800004",
                data: r,
                mess: "注册失败",
              };
            }
          })
          .catch((err) => {
            ctx.body = {
              code: "800002",
              data: err,
            };
          });
      }
    })
    .catch((err) => {
      ctx.body = {
        code: "800002",
        data: err,
      };
    });
});
// 查看积分数
router.get('/findPointes', async (ctx, next) => {
  await userService
    .findPointes()
    .then((res) => {
      let r = "";
      if (res.length) {
        r = "ok";
        ctx.body = {
          code: "200",
          data: res,
          mess: "ok",
        };
      } else {
        r = "error";
        ctx.body = {
          code: "400",
          data: r,
          mess: "查询失败",
        };
      }
    })
    .catch((err) => {
      ctx.body = {
        code: "200",
        data: err,
      };
    });
})
// 发布积分
router.post('/publishPointes', async (ctx, next) => {
  var _remainPointes = ctx.request.body.remainPointes;
  await userService.publishPointes(_remainPointes).then((res) => {
    let r = "";
    if (_remainPointes !== '') {
      r = "ok";
      ctx.body = {
        code: "200",
        // data: result,
        mess: "发布成功",
      };
    } else {
      r = "error";
      ctx.body = {
        code: "400",
        data: r,
        mess: "发布失败",
      };
    }
  })
    .catch((err) => {
      ctx.body = {
        code: "200",
        data: err,
      };
    });
})
// 商品详情
router.post('/goodDetails', async (ctx, next) => {
  var _imgId = ctx.request.body.imgId;
  await userService.goodDetails(_imgId).then((res) => {
    let r = "";
    if (res.length) {
      r = "ok";
      ctx.body = {
        code: "200",
        data: res,
        mess: "ok",
      };
    } else {
      r = "error";
      ctx.body = {
        code: "400",
        data: r,
        mess: "查询失败",
      };
    }
  })
    .catch((err) => {
      ctx.body = {
        code: "200",
        data: err,
      };
    });
})
module.exports = router;

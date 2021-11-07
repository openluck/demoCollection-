/*
 * @Desc: 
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-08-02 15:29:00
 * @LastEditors: went
 * @LastEditTime: 2021-08-18 10:09:57
 */
const Mock = require("mockjs");

// 修改
const getUserInfo = function() {
  const data = {
    result: true,
    code: "200",
    message: "查询成功",
    // data: {},
    data: {
      // menuListL: "[]",
      menuList:
        '[{"id":502,"icons":"jigou","title":"功能1","path":"AgencyApplication","scopedSlots":{"title":"custom"},"children":[{"id":2785,"title":"机构和账户","path":"/AgencyApplication/AgencyAccount","scopedSlots":{"title":"custom"}},{"id":9000,"title":"三方应用信息","path":"/AgencyApplication/ApplicationMessage","scopedSlots":{"title":"custom"}}]},{"id":9877,"icons":"xitong","title":"功能2","path":"SystemManagement","scopedSlots":{"title":"custom"},"children":[{"id":1539,"title":"敏感词库","path":"/SystemManagement/SensitiveWord","scopedSlots":{"title":"custom"}}]}]',
      gender: "2",
      nickName: "2020年10月27日11:11:56",
      contactName: "测试",
      remark: "2020年9月4日14:05:0423",
      userId: "1",
      realName: "测试",
      password: "admin123",
      phoneNumber: "15982823757",
      PASSWORD: "admin123",
      roleKey: 1,
      roleName: "超级管理员",
      account: "admin",
      email: "123456@123.com",
    },
    version: "v1.00",
    total: 0,
  };
  return data;
};
const login = function() {
  const data = {
    code: "200",
    data: "749a6f86911e3cf61ec591d074cc81e0",
    message: "登录成功",
    result: true,
    total: 0,
  };
  return data;
};
//角色管理
const roleList = function() {
  const data = {
    code: "200",
    message: "success",
    result: true,
    data: {
      list: [
        {
          roleName: "超级管理员",
          roleId: "1",
          ownPermission: "权限一，权限二",
          remark: "超级管理员超级管理员",
          status: "1",
        },
        {
          roleName: "超级管理员",
          roleId: "2",
          ownPermission: "权限一，权限二",
          remark: "超级管理员超级管理员",
          status: "1",
        },
        {
          roleName: "超级管理员",
          roleId: "3",
          ownPermission: "权限一，权限二",
          remark: "超级管理员超级管理员",
          status: "1",
        },
        {
          roleName: "超级管理员",
          roleId: "4",
          ownPermission: "权限一，权限二",
          remark: "超级管理员超级管理员",
          status: "1",
        },
      ],
      total: 100,
    },
  };
  return data;
};

Mock.mock("/user/info", "post", getUserInfo);
Mock.mock("/login", "post", login);

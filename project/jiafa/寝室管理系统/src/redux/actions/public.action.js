/*
 * @Author: xq 
 * @Date: 2021-01-13 13:39:14 
 * @Last Modified by: xq
 * @Last Modified time: 2021-01-13 14:20:12
 */

const types = {
    INIT_PRIMARY_APP_PROPS: "INIT_PRIMARY_APP_PROPS",  // 存储token和orgCode
    DELE_PRIMARY_APP_PROPS: "DELE_PRIMARY_APP_PROPS",  // 清除token和orgCode
    GET_USER_INFO: "GET_USER_INFO",    // 获取用户信息存储
    GET_BUILD_TREE: "GET_BUILD_TREE",  // 获取楼栋树
    GET_CLASS_TREE: "GET_CLASS_TREE",  // 获取班级树
};

export const initQueryString_action = (wants = "init", data = {}) => {
    return {
        type:
            wants === "init"
                ? types.INIT_PRIMARY_APP_PROPS
                : types.DELE_PRIMARY_APP_PROPS,
        data,
    };
};

export const getUserInfo_action = (userinfo = {}) => {
    return {
      type: types.GET_USER_INFO,
      data: userinfo,
    };
};

export const getBuildTree_action = (build = {}) => {
    return {
      type: types.GET_BUILD_TREE,
      data: build,
    };
};

export const getClassTree_action = (classes = {}) => {
    return {
      type: types.GET_CLASS_TREE,
      data: classes,
    };
};

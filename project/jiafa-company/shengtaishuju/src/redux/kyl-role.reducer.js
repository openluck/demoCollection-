/*
 * @Author: kyl 
 * @Date: 2021-01-19 14:03:39 
 * @Last Modified by: kyl
 * @Last Modified time: 2021-01-28 09:40:17
 */

import { request } from "../util/request";
import { message } from "antd";
// import { saveAs } from 'file-saver';
const initState = {
  allRole: [],
  allLoading: false,
  list: [], // 表格数据
  liTotal: 0, // 总数
  loading: false,
  total: 0,
  roleId: '',
  roleList: []
}

export const kyl_role_reducer = (state = initState, action) => {
  switch (action.type) {
    case 'ROLE':
      return {
        ...state,
        ...action.data
      }
    case 'ALL_ROLE':
      return {
        ...state,
        ...action.data
      }
    case 'CHANGE_ROLE':
      return {
        ...state,
        ...action.data
      }
    case 'ROLE_LIST':
      return {
        ...state,
        ...action.data
      }
    default:
      return {
        ...state
      }
  }
}

export const clean_data = (roleId) => {
  return dispatch => {
    dispatch({
      type: 'CLEAN_DATA',
      list: []
    })
    dispatch(kyl_change_tab(roleId));
  }
}

export const kyl_get_role_list = (type) => {
  return (dispatch, getState) => {
    request('/api/system/getRoles', { type }, (res) => {
      if (res.data && res.result) {
        dispatch(kyl_change_tab(res.data[0].roleId))
        dispatch({
          type: 'ROLE_LIST',
          data: {
            roleList: res.data
          }
        })
        // dispatch(kyl_queryRole({ roleId: res.data[0].roleId }))
      } else {
        message.warn(res.message)
        dispatch({
          type: 'ROLE_LIST',
          data: {
            roleList: []
          }
        })
      }
    }, () => {
      dispatch({
        type: 'ROLE_LIST',
        data: {
          roleList: []
        }
      })
    })
  }
}

export const kyl_change_tab = (roleId) => {
  return dispatch => {
    dispatch({
      type: 'CHANGE_ROLE',
      data: {
        roleId
      }
    })
    dispatch(kyl_queryRole({ roleId }))
  }
}

export const kyl_queryRole = (data) => {
  console.log(data);
  return dispatch => {
    dispatch({
      type: 'ROLE',
      data: {
        loading: true
      }
    })
    request('/api/system/getRoleList', data, (res) => {
      if (res.data && res.result) {
        dispatch({
          type: 'ROLE',
          data: {
            loading: false,
            list: res.data,
            liTotal: res.total
          }
        })
      } else {
        message.warn(res.message)
        dispatch({
          type: 'ROLE',
          data: {
            loading: false,
            list: [],
            liTotal: 0
          }
        })
      }
    }, () => {
      dispatch({
        type: 'ROLE',
        data: {
          loading: false,
          list: [],
          liTotal: 0
        }
      })
    })

  }
}


export const kyl_queryAllRole = (data) => {
  console.log(data);
  return (dispatch, getState) => {
    dispatch({
      type: 'ALL_ROLE',
      data: {
        allLoading: true,
      }
    })
    request('/api/system/getAllRoleList', data, (res) => {
      if (res.data && res.result) {
        let beSelData = getState().kyl_role_reducer.list;
        for (let i = 0; i < res.data.length; i++) {
          for (let j = 0; j < beSelData.length; j++) {
            if (res.data[i].id === beSelData[j].id) {
              res.data[i].disabled = true;
            }
          }
        }
        console.log(res.data);
        dispatch({
          type: 'ALL_ROLE',
          data: {
            allLoading: false,
            allRole: res.data,
            total: res.total,
          }
        })
      } else {
        message.warn(res.message)
        dispatch({
          type: 'ALL_ROLE',
          data: {
            allLoading: false,
            allRole: [],
            total: 0,
          }
        })
      }
    }, () => {
      dispatch({
        type: 'ALL_ROLE',
        data: {
          allLoading: false,
          allRole: [],
          total: 0,
        }
      })
    })
  }
}

export const kyl_add_role = (data) => {
  return (dispatch, getState) => {
    request('/api/system/addRole', data, (res) => {
      if (res.result) {
        message.success('添加成功')
        dispatch(kyl_queryRole({ roleId: getState().kyl_role_reducer.roleId }))
      } else {
        message.warn(res.message)
      }
    }, () => {

    })
  }
}

export const kyl_del_role = (data) => {
  console.log(data)
  // debugger
  return (dispatch, getState) => {
    console.log(data)
    request('/api/system/delRole', data, (res) => {
      if (res.result) {
        message.success('移除成功')
        dispatch(kyl_queryRole({ roleId: getState().kyl_role_reducer.roleId }))
      } else {
        message.warn(res.message)
      }
    }, () => {

    })
  }
}

export const kyl_set_phone = (data) => {
  return (dispatch, getState) => {
    request('/api/system/updatePhone', data, (res) => {
      if (res.result) {
        message.success('操作成功');
        dispatch(kyl_queryRole({ roleId: getState().kyl_role_reducer.roleId }))
      } else {
        message.warn(res.message);
      }
    }, () => {

    })
  }
}
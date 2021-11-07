/*
 * @Author: zoe ღ
 * @Date: 2020-02-10 17:06:46
 * @Last Modified by: zoe ღ
 * @Last Modified time: 2020-03-13 14:20:09
 * 教学质量redux
 */
import { request } from "../util/request";
import {message} from "antd"

const initState = {
  /******教学质量>课程统计 ********/
  ClaSchHea: {}, //学校级统计值
  ClaColHea: {}, //学院级统计值
  ClaAdmHea: {}, //课程统计值
  ClaRoomHea: {}, //教学班统计值
  QuaClaColSta: {
    list: [],
    total: 0
  }, //学院
  QuaClaCourSta: {
    list: [],
    total: 0
  }, //课程
  QuaClaAdmSta: {
    list: [],
    total: 0
  }, //教学班
  QuaClaRoomSta: {
    list: [],
    total: 0
  }, //课堂
  /******教学质量>教师统计 ********/
  MasSchHea: {}, //学校级统计值
  MasColHea: {}, //学院级统计值
  MasTeaHea: {}, //教师统计值
  MasAdmHea: {}, //教学班统计值
  QuaMasColSta: {
    list: [],
    total: 0
  }, //学院
  QuaMasTeaSta: {
    list: [],
    total: 0
  }, //教师
  QuaMasAdmSta: {
    list: [],
    total: 0
  }, //教学班
  QuaMasRoomSta: {
    list: [],
    total: 0
  }, //课堂
  isLoading: false //表格loading
};

export const zoe_quaData = (state = initState, action) => {
  switch (action.type) {
    /***********教学质量>教师统计************/
    case "MasSchHea":
      return {
        ...state,
        MasSchHea: action.data
      };
    case "MasColHea":
      return {
        ...state,
        MasColHea: action.data
      };
    case "MasTeaHea":
      return {
        ...state,
        MasTeaHea: action.data
      };
    case "MasAdmHea":
      return {
        ...state,
        MasAdmHea: action.data
      };
    case "QuaMasColSta":
      return {
        ...state,
        QuaMasColSta: action.data
      };
    case "QuaMasTeaSta":
      return {
        ...state,
        QuaMasTeaSta: action.data
      };
    case "QuaMasAdmSta":
      return {
        ...state,
        QuaMasAdmSta: action.data
      };
    case "QuaMasRoomSta":
      return {
        ...state,
        QuaMasRoomSta: action.data
      };
    /***********教学质量>课程统计************/
    case "ClaSchHea":
      return {
        ...state,
        ClaSchHea: action.data
      };
    case "ClaColHea":
      return {
        ...state,
        ClaColHea: action.data
      };
    case "ClaAdmHea":
      return {
        ...state,
        ClaAdmHea: action.data
      };
    case "ClaRoomHea":
      return {
        ...state,
        ClaRoomHea: action.data
      };
    //列表统计
    case "QuaClaColSta":
      return {
        ...state,
        QuaClaColSta: action.data
      };
    case "QuaClaCourSta":
      return {
        ...state,
        QuaClaCourSta: action.data
      };
    case "QuaClaAdmSta":
      return {
        ...state,
        QuaClaAdmSta: action.data
      };
    case "QuaClaRoomSta":
      return {
        ...state,
        QuaClaRoomSta: action.data
      };
    case "isLoading":
      return {
        ...state,
        isLoading: action.data
      };
    default:
      return {
        ...state
      };
  }
};

/**********教学质量>课程统计************/
//获取学校级统计值
export const zoe_getClaSchHea = params => {
  return dispatch => {
    request("/api/data/teachingMass/getClaSchHea", params, res => {
      if (res.result) {
        dispatch({
          type: "ClaSchHea",
          data: res.data
        });
      } else {
        let data = {
          courseTotal: 0, //课程总数
          stuStand: 0,
          teacherDown: 0
        };
        dispatch({
          type: "ClaSchHea",
          data
        });
      }
    });
  };
};
//获取学院统计列表接口函数
export const zoe_Qua_getClaColSta = params => {
  return dispatch => {
    dispatch(isLoading(true));
    request(
      "/api/data/teachingMass/getClaSta",
      params,
      res => {
        if (res.result && res.data) {
          dispatch({
            type: "QuaClaColSta",
            data: {
              total: res.total,
              list: res.data
            }
          });
        } else {
          dispatch({
            type: "QuaClaColSta",
            data: {
              total: 0,
              list: []
            }
          });
        }
        dispatch(isLoading(false));
      },
      () => {
        dispatch(isLoading(false));
      }
    );
  };
};
//获取学院级统计值
export const zoe_getClaColHea = params => {
  return dispatch => {
    request("/api/data/teachingMass/getClaColHea", params, res => {
      if (res.result) {
        dispatch({
          type: "ClaColHea",
          data: res.data
        });
      } else {
        let data = {
          courseTotal: 0, //课程总数
          stuStand: 0,
          teacherDown: 0
        };
        dispatch({
          type: "ClaColHea",
          data
        });
      }
    });
  };
};
//获取课程统计列表接口函数
export const zoe_Qua_getClaCourSta = params => {
  return dispatch => {
    dispatch(isLoading(true));
    request(
      "/api/data/teachingMass/getClaCourSta",
      params,
      res => {
        if (res.result && res.data) {
          dispatch({
            type: "QuaClaCourSta",
            data: {
              total: res.total,
              list: res.data
            }
          });
        } else {
          dispatch({
            type: "QuaClaCourSta",
            data: {
              total: 0,
              list: []
            }
          });
        }
        dispatch(isLoading(false));
      },
      () => {
        dispatch(isLoading(false));
      }
    );
  };
};
//获取课程统计值
export const zoe_getClaAdmHea = params => {
  return dispatch => {
    request("/api/data/teachingMass/getClaAdmHea", params, res => {
      if (res.result) {
        dispatch({
          type: "ClaAdmHea",
          data: res.data
        });
      } else {
        let data = {
          teaClaTotal: 0, //教学班总数
          stuStand: 0,
          teacherDown: 0
        };
        dispatch({
          type: "ClaAdmHea",
          data
        });
      }
    });
  };
};
//获取教学班统计列表接口函数
export const zoe_Qua_getClaAdmSta = params => {
  return dispatch => {
    dispatch(isLoading(true));
    request(
      "/api/data/teachingMass/getClaAdmSta",
      params,
      res => {
        if (res.result && res.data) {
          dispatch({
            type: "QuaClaAdmSta",
            data: {
              total:res.total,
              list: res.data
            }
          });
        } else {
          dispatch({
            type: "QuaClaAdmSta",
            data: {
              total: 0,
              list: []
            }
          });
        }
        dispatch(isLoading(false));
      },
      () => {
        dispatch(isLoading(false));
      }
    );
  };
};
//获取教学班统计值
export const zoe_getClaRoomHea = params => {
  return dispatch => {
    request("/api/data/teachingMass/getClaRoomHea", params, res => {
      if (res.result) {
        dispatch({
          type: "ClaRoomHea",
          data: res.data
        });
      } else {
        let data = {
          teacherName: "",
          claRoomTotal: 0, //课堂总数
          stuNum: 0, //学生人数
          stuStand: 0,
          teacherDown: 0
        };
        dispatch({
          type: "ClaRoomHea",
          data
        });
      }
    });
  };
};
//获取课堂统计列表接口函数
export const zoe_Qua_getClaRoomSta = params => {
  return dispatch => {
    dispatch(isLoading(true));
    request(
      "/api/data/teachingMass/getClaRoomSta",
      params,
      res => {
        if (res.result && res.data) {
          dispatch({
            type: "QuaClaRoomSta",
            data: {
              total: res.total,
              list: res.data
            }
          });
        } else {
          dispatch({
            type: "QuaClaRoomSta",
            data: {
              total: 0,
              list: []
            }
          });
        }
        dispatch(isLoading(false));
      },
      () => {
        dispatch(isLoading(false));
      }
    );
  };
};

/**********教学质量>教师统计************/
//获取学校级统计值
export const zoe_getMasSchHea = params => {
  return dispatch => {
    request("/api/data/teachingMass/getMasSchHea", params, res => {
      if (res.result) {
        dispatch({
          type: "MasSchHea",
          data: res.data
        });
      } else {
        let data = {
          teacherTotal: 0, //教师总数
          stuStand: 0,
          teacherDown: 0
        };
        dispatch({
          type: "MasSchHea ",
          data
        });
      }
    });
  };
};
//获取学院统计列表接口函数
export const zoe_Qua_getMasColSta = params => {
  return dispatch => {
    dispatch(isLoading(true));
    request(
      "/api/data/teachingMass/getMasColSta",
      params,
      res => {
        if (res.result && res.data) {
          dispatch({
            type: "QuaMasColSta",
            data: {
              total: res.total,
              list: res.data
            }
          });
        } else {
          dispatch({
            type: "QuaMasColSta",
            data: {
              total: 0,
              list: []
            }
          });
        }
        dispatch(isLoading(false));
      },
      () => {
        dispatch(isLoading(false));
      }
    );
  };
};
//获取学院级统计值
export const zoe_getMasColHea = params => {
  return dispatch => {
    request(
      "/api/data/teachingMass/getMasColHea",
      params,
      res => {
        if (res.result) {
          dispatch({
            type: "MasColHea",
            data: res.data
          });
        } else {
          let data = {
            teacherTotal: 0, //教师总数
            stuStand: 0,
            teacherDown: 0
          };
          dispatch({
            type: "MasColHea",
            data
          });
        }
      });
  };
};
//获取教师统计列表接口函数
export const zoe_Qua_getMasTeaSta = params => {
  return dispatch => {
    dispatch(isLoading(true));
    request("/api/data/teachingMass/getMasTeaSta", params, res => {
      if (res.result && res.data) {
        dispatch({
          type: "QuaMasTeaSta",
          data: {
            total: res.total,
            list: res.data
          }
        });
      } else {
        dispatch({
          type: "QuaMasTeaSta",
          data: {
            total: 0,
            list: []
          }
        });
      }
      dispatch(isLoading(false));
    },()=>{
      dispatch(isLoading(false));
    });
  };
};
//获取教师统计值接口函数
export const zoe_getMasTeaHea = params => {
    return dispatch => {
      request("/api/data/teachingMass/getMasTeaHea", params, res => {
        if(res.result){
          dispatch({
            type: "MasTeaHea",
            data:res.data
          });
        }else{
          let data = {
            teaClaTotal: 0, //教学班总数
            stuStand: 0,
            teacherDown: 0
          };
          dispatch({
            type: "MasTeaHea",
            data
          });
        }
      })
    };
};
//获取教学班统计列表接口函数
export const zoe_Qua_getMasAdmSta = params => {
  return dispatch => {
    dispatch(isLoading(true));
    request("/api/data/teachingMass/getMasAdmSta", params, res => {
      if(res.result&&res.data){
        dispatch({
          type: "QuaMasAdmSta",
          data: {
            total: res.total,
            list:res.data
          }
        });
      }else{
        dispatch({
          type: "QuaMasAdmSta",
          data: {
            total: 0,
            list:[]
          }
        });
      }
    dispatch(isLoading(false));
    },()=>{
    dispatch(isLoading(false));
    })
  };
};
//获取教学班统计值接口函数
export const zoe_getMasAdmHea = params => {
  return dispatch => {
    request("/api/data/teachingMass/getMasAdmHea", params, res => {
      if(res.result){
        dispatch({
          type: "MasAdmHea",
          data:res.data
        });
      }else{
        let data = {
          claRoomTotal: 0, //课堂总数
          stuNum: 0, //学生人数
          teacherName: "",
          stuStand:0,
          teacherDown: 0
        };
        dispatch({
          type: "MasAdmHea",
          data
        });
      }
    })
  };
};
//获取课堂统计列表接口函数
export const zoe_Qua_getMasRoomSta = params => {
  return dispatch => {
    dispatch(isLoading(true));
    request("/api/data/teachingMass/getMasRoomSta", params, res => {
      if(res.result&&res.data){
        dispatch({
          type: "QuaMasRoomSta",
          data: {
            total:res.total,
            list:res.data
          }
        });
      }else{
        dispatch({
          type: "QuaMasRoomSta",
          data: {
            total: 0,
            list:[]
          }
        });
      }
      dispatch(isLoading(false));
    },()=>{
      dispatch(isLoading(false));
    })
  };
};
/**************点击下载报表的接口函数***************/
/*********教学质量>课程统计********/
//学院统计下载
export const zoe_Qua_downClaColSta = data => {
  return dispatch => {
    request(
      "/api/data/teachingMass/downClaSta",
      data,
      (res,name) => {
        let blob = new Blob([res], { type: "application/x-xls" });
        saveAs(blob, name);
      },
      res => {
        message.warning("下载失败，请刷新页面或者联系管理员", 2);
      },
      true
    );
  };
};
//课程统计下载
export const zoe_Qua_downClaCourSta = data => {
  return dispatch => {
    request(
      "/api/data/teachingMass/downClaCourSta",
      data,
      (res,name) => {
        let blob = new Blob([res], { type: "application/x-xls" });
        saveAs(blob, name);
      },
      res => {
        message.warning("下载失败，请刷新页面或者联系管理员", 2);
      },
      true
    );
  };
};
//教学班统计下载
export const zoe_Qua_downClaAdmSta = data => {
  return dispatch => {
    request(
      "/api/data/teachingMass/downClaAdmSta",
      data,
      (res,name) => {
        let blob = new Blob([res], { type: "application/x-xls" });
        saveAs(blob, name);
      },
      res => {
        message.warning("下载失败，请刷新页面或者联系管理员", 2);
      },
      true
    );
  };
};
//课堂统计下载
export const zoe_Qua_downClaRoomSta = data => {
  return dispatch => {
    request(
      "/api/data/teachingMass/downClaRoomSta",
      data,
      (res,name) => {
        let blob = new Blob([res], { type: "application/x-xls" });
        saveAs(blob, name);
      },
      res => {
        message.warning("下载失败，请刷新页面或者联系管理员", 2);
      },
      true
    );
  };
};
/*********教学质量>教师统计********/
//学院统计下载
export const zoe_Qua_downMasColSta = data => {
  return dispatch => {
    request(
      "/api/data/teachingMass/downMasColSta",
      data,
      (res,name) => {
        let blob = new Blob([res], { type: "application/x-xls" });
        saveAs(blob, name);
      },
      res => {
        message.warning("下载失败，请刷新页面或者联系管理员", 2);
      },
      true
    );
  };
};
//教师统计下载
export const zoe_Qua_downMasTeaSta = data => {
  return dispatch => {
    request('/api/data/teachingMass/downMasTeaSta',data, (res,name) => {
        let blob = new Blob([res], { type: 'application/x-xls' });
        saveAs(blob, name)
    }, (res) => {
        message.warning('下载失败，请刷新页面或者联系管理员', 2)
    }, true)
  };
};
//教学班统计下载
export const zoe_Qua_downMasAdmSta = data => {
  return dispatch => {
    request('/api/data/teachingMass/downMasAdmSta',data, (res,name) => {
        let blob = new Blob([res], { type: 'application/x-xls' });
        saveAs(blob, name)
    }, (res) => {
        message.warning('下载失败，请刷新页面或者联系管理员', 2)
    }, true)
  };
};
//课堂统计下载
export const zoe_Qua_downMasRoomSta = data => {
  return dispatch => {
    request('/api/data/teachingMass/downMasRoomSta',data, (res,name) => {
        let blob = new Blob([res], { type: 'application/x-xls' });
        saveAs(blob, name)
    }, (res) => {
        message.warning('下载失败，请刷新页面或者联系管理员', 2)
    }, true)
  };
};
//是否显示loading
export function isLoading(bool) {
  return dispatch => {
    dispatch({
      type: "isLoading",
      data: bool
    });
  };
}

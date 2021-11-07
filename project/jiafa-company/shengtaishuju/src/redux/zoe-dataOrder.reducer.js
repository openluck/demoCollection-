/*
 * @Author: zoe ღ
 * @Date: 2020-02-10 17:06:46
 * @Last Modified by: zoe ღ
 * @Last Modified time: 2020-03-04 15:55:25
 * 教学秩序redux
 */
import { request } from "../util/request";
import {message} from "antd"

const initState = {
  /******教学秩序>课程统计 ********/
  ClaSchRate: {}, //学校级统计率
  ClaColRate: {}, //学院级统计率
  ClaCourRate: {}, //课程统计率
  ClaRoomRate: {}, //教学班统计率
  ClaColSta: {
    list: [],
    total: 0
  }, //学院
  ClaCourSta: {
    list: [],
    total: 0
  }, //课程
  ClaAdmSta: {
    list: [],
    total: 0
  }, //教学班
  ClaRoomSta: {
    list: [],
    total: 0
  }, //课堂
  /******教学秩序>教师统计 ********/
  MasSchRate: {}, //学校级统计率
  MasColRate: {}, //学院级统计率
  MasTeaRate: {}, //教师统计率
  MasAdmRate: {}, //教学班统计率
  MasColSta: {
    list: [],
    total: 0
  }, //学院
  MasTeaSta: {
    list: [],
    total: 0
  }, //教师
  MasAdmSta: {
    list: [],
    total: 0
  }, //教学班
  MasRoomSta: {
    list: [],
    total: 0
  }, //课堂
  isLoading: false //表格loading
};

export const zoe_orderData = (state = initState, action) => {
  switch (action.type) {
    /***********教学秩序>教师统计************/
    case "MasSchRate":
      return {
        ...state,
        MasSchRate: action.data
      };
    case "MasColRate":
      return {
        ...state,
        MasColRate: action.data
      };
    case "MasTeaRate":
      return {
        ...state,
        MasTeaRate: action.data
      };
    case "MasAdmRate":
      return {
        ...state,
        MasAdmRate: action.data
      };
    case "MasColSta":
      return {
        ...state,
        MasColSta: action.data
      };
    case "MasTeaSta":
      return {
        ...state,
        MasTeaSta: action.data
      };
    case "MasAdmSta":
      return {
        ...state,
        MasAdmSta: action.data
      };
    case "MasRoomSta":
      return {
        ...state,
        MasRoomSta: action.data
      };
    /***********教学秩序>课程统计************/
    case "ClaSchRate":
      return {
        ...state,
        ClaSchRate: action.data
      };
    case "ClaColRate":
      return {
        ...state,
        ClaColRate: action.data
      };
    case "ClaCourRate":
      return {
        ...state,
        ClaCourRate: action.data
      };
    case "ClaRoomRate":
      return {
        ...state,
        ClaRoomRate: action.data
      };
    case "ClaColSta":
      return {
        ...state,
        ClaColSta: action.data
      };
    case "ClaCourSta":
      return {
        ...state,
        ClaCourSta: action.data
      };
    case "ClaAdmSta":
      return {
        ...state,
        ClaAdmSta: action.data
      };
    case "ClaRoomSta":
      return {
        ...state,
        ClaRoomSta: action.data
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

/**********教学秩序>课程统计************/
//获取学校级统计率接口函数
export const zoe_getClaSchRate = params => {
  return dispatch => {
    request("/api/data/teachingOrder/getClaSchRate", params, res => {
      if (res.result) {
        dispatch({
          type: "ClaSchRate",
          data:res.data
        });
      } else {
        let data = {
          courseTotal: 0,
          teaAtNormalRate: 0,
          stuOnAttRate: 0,
          disClaRate: 0,
          sleepRate: 0,
          frontSeatRate:0
        };
        dispatch({
          type: "ClaSchRate",
          data
        });
      }
    });
  };
};
//获取学院统计列表接口函数
export const zoe_getClaColSta = params => {
  return dispatch => {
    dispatch(isLoading(true));
    request(
      "/api/data/teachingOrder/getClaColSta",
      params,
      res => {
        if (res.result && res.data) {
          dispatch({
            type: "ClaColSta",
            data: {
              total: res.total,
              list: res.data
            }
          });
        } else {
          dispatch({
            type: "ClaColSta",
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
//获取学院级统计率接口函数
export const zoe_getClaColRate = params => {
  return dispatch => {
    request("/api/data/teachingOrder/getClaColRate", params, res => {
      if (res.result) {
        dispatch({
          type: "ClaColRate",
          data: res.data
        });
      } else {
        let data = {
          courseTotal: 0,
          teaAtNormalRate: 0,
          stuOnAttRate: 0,
          disClaRate: 0,
          frontSeatRate: 0,
          sleepRate: 0
        };
        dispatch({
          type: "ClaColRate",
          data
        });
      }
    });
  };
};
//获取课程统计列表接口函数
export const zoe_getClaCourSta = params => {
  return dispatch => {
    dispatch(isLoading(true));
    request(
      "/api/data/teachingOrder/getClaCourSta",
      params,
      res => {
        if (res.result && res.data) {
          dispatch({
            type: "ClaCourSta",
            data: {
              total: res.total,
              list: res.data
            }
          });
        } else {
          dispatch({
            type: "ClaCourSta",
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
//获取课程统计率接口函数
export const zoe_getClaCourRate = params => {
  return dispatch => {
    request("/api/data/teachingOrder/getClaCourRate", params, res => {
      if (res.result) {
        dispatch({
          type: "ClaCourRate",
          data: res.data
        });
      } else {
        let data = {
          teaClaTotal: 0, //教学班总数
          teaAtNormalRate: 0,
          stuOnAttRate: 0,
          disClaRate: 0,
          frontSeatRate: 0,
          sleepRate: 0
        };
        dispatch({
          type: "ClaCourRate",
          data
        });
      }
    });
  };
};
//获取教学班统计列表接口函数
export const zoe_getClaAdmSta = params => {
  return dispatch => {
    dispatch(isLoading(true));
    request(
      "/api/data/teachingOrder/getClaAdmSta",
      params,
      res => {
        if (res.result && res.data) {
          dispatch({
            type: "ClaAdmSta",
            data: {
              total: res.total,
              list: res.data
            }
          });
        } else {
          dispatch({
            type: "ClaAdmSta",
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
//获取教学班统计率接口函数
export const zoe_getClaRoomRate = params => {
  return dispatch => {
    request("/api/data/teachingOrder/getClaRoomRate", params, res => {
      if (res.result) {
        dispatch({
          type: "ClaRoomRate",
          data: res.data
        });
      } else {
        let data = {
          claRoomTotal: 0, //课堂总数
          stuNum: 0, //学生人数
          teacherName: "",
          teaAtNormalRate: 0,
          stuOnAttRate: 0,
          disClaRate: 0,
          frontSeatRate: 0,
          sleepRate: 0
        };
        dispatch({
          type: "ClaRoomRate",
          data
        });
      }
    });
  };
};
//获取课堂统计列表接口函数
export const zoe_getClaRoomSta = params => {
  return dispatch => {
    dispatch(isLoading(true));
    request(
      "/api/data/teachingOrder/getClaRoomSta",
      params,
      res => {
        if (res.result && res.data) {
          dispatch({
            type: "ClaRoomSta",
            data: {
              total: res.total,
              list: res.data
            }
          });
        } else {
          dispatch({
            type: "ClaRoomSta",
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

/**********教学秩序>教师统计************/
//获取学校级统计率接口函数
export const zoe_getMasSchRate = params => {
  return dispatch => {
    request("/api/data/teachingOrder/getMasSchRate", params, res => {
      if (res.result) {
        dispatch({
          type: "MasSchRate",
          data: res.data
        });
      } else {
        let data = {
          teacherTotal: 0, //教师总数
          teaAtNormalRate: 0,
          stuOnAttRate: 0,
          disClaRate: 0,
          frontSeatRate: 0,
          sleepRate: 0
        };
        dispatch({
          type: "MasSchRate",
          data
        });
      }
    });
  };
};
//获取学院统计列表接口函数
export const zoe_getMasColSta = params => {
  return dispatch => {
    dispatch(isLoading(true));
    request(
      "/api/data/teachingOrder/getMasColSta",
      params,
      res => {
        if (res.result && res.data) {
          dispatch({
            type: "MasColSta",
            data: {
              total: res.total,
              list: res.data
            }
          });
        } else {
          dispatch({
            type: "MasColSta",
            data: {
              total: 0,
              list: []
            }
          });
        }
        dispatch(isLoading(false));
      },
      () => {
        dispatch(isLoading(true));
      }
    );
  };
};
//获取学院级统计率接口函数
export const zoe_getMasColRate = params => {
  return dispatch => {
    request("/api/data/teachingOrder/getMasColRate", params, res => {
      if (res.result) {
        dispatch({
          type: "MasColRate",
          data: res.data
        });
      } else {
        let data = {
          teacherTotal: 0,
          teaAtNormalRate: 0,
          stuOnAttRate: 0,
          disClaRate: 0,
          frontSeatRate: 0,
          sleepRate: 0
        };
        dispatch({
          type: "MasColRate",
          data
        });
      }
    });
  };
};
//获取教师统计列表接口函数
export const zoe_getMasTeaSta = params => {
  return dispatch => {
    dispatch(isLoading(true));
    request(
      "/api/data/teachingOrder/getMasTeaSta",
      params,
      res => {
        if (res.result && res.data) {
          dispatch({
            type: "MasTeaSta",
            data: {
              total: res.total,
              list: res.data
            }
          });
        } else {
          dispatch({
            type: "MasTeaSta",
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
//获取教师统计率接口函数
export const zoe_getMasTeaRate = params => {
  return dispatch => {
    request("/api/data/teachingOrder/getMasTeaRate", params, res => {
      if (res.result) {
        dispatch({
          type: "MasTeaRate",
          data: res.data
        });
      } else {
        let data = {
          teaClaTotal: 0, //教学班总数
          teaAtNormalRate: 0,
          stuOnAttRate: 0,
          disClaRate: 0,
          frontSeatRate: 0,
          sleepRate: 0
        };
        dispatch({
          type: "MasTeaRate",
          data
        });
      }
    });
  };
};
//获取教学班统计列表接口函数
export const zoe_getMasAdmSta = params => {
  return dispatch => {
    dispatch(isLoading(true));
    request(
      "/api/data/teachingOrder/getMasAdmSta",
      params,
      res => {
        if (res.result && res.data) {
          dispatch({
            type: "MasAdmSta",
            data: {
              total: res.total,
              list: res.data
            }
          });
        } else {
          dispatch({
            type: "MasAdmSta",
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
//获取教学班统计率接口函数
export const zoe_getMasAdmRate = params => {
  return dispatch => {
    request("/api/data/teachingOrder/getMasAdmRate", params, res => {
      if (res.result) {
        dispatch({
          type: "MasAdmRate",
          data: res.data
        });
      } else {
        let data = {
          claRoomTotal: 0, //课堂总数
          stuNum: 0, //学生人数
          teacherName: "",
          teaAtNormalRate: 0,
          stuOnAttRate: 0,
          disClaRate: 0,
          frontSeatRate: 0,
          sleepRate: 0
        };
        dispatch({
          type: "MasAdmRate",
          data
        });
      }
    });
  };
};
//获取课堂统计列表接口函数
export const zoe_getMasRoomSta = params => {
  return dispatch => {
    dispatch(isLoading(true));
    request(
      "/api/data/teachingOrder/getMasRoomSta",
      params,
      res => {
        if (res.result && res.data) {
          dispatch({
            type: "MasRoomSta",
            data: {
              total: res.total,
              list: res.data
            }
          });
        } else {
          dispatch({
            type: "MasRoomSta",
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

/**************点击下载报表的接口函数***************/
/*********教学秩序>课程统计********/
//学院统计下载
export const zoe_downClaColSta = data => {
  return dispatch => {
    request(
      "/api/data/teachingOrder/downClaColSta",
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
export const zoe_downClaCourSta = data => {
  return dispatch => {
    request(
      "/api/data/teachingOrder/downClaCourSta",
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
export const zoe_downClaAdmSta = data => {
  return dispatch => {
    request(
      "/api/data/teachingOrder/downClaAdmSta",
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
export const zoe_downClaRoomSta = data => {
  return dispatch => {
    request(
      "/api/data/teachingOrder/downClaRoomSta",
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

/*********教学秩序>教师统计********/
//学院统计下载
export const zoe_downMasColSta = data => {
  return dispatch => {
    request(
      "/api/data/teachingOrder/downMasColSta",
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
export const zoe_downMasTeaSta = data => {
  return dispatch => {
    request(
      "/api/data/teachingOrder/downMasTeaSta",
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
export const zoe_downMasAdmSta = data => {
  return dispatch => {
    request(
      "/api/data/teachingOrder/downMasAdmSta",
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
export const zoe_downMasRoomSta = data => {
  return dispatch => {
    request(
      "/api/data/teachingOrder/downMasRoomSta",
      data,
      (res,name) => {
        let blob = new Blob([res], { type: "application/x-xls" });
        saveAs(blob,name);
      },
      res => {
        message.warning("下载失败，请刷新页面或者联系管理员", 2);
      },
      true
    );
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

/*
 * @Author: lxx
 * @Date: 2020-01-23 09:33:00
 * @Last Modified by: tj
 * @Last Modified time: 2021-02-07 10:24:52
 * 教学秩序-教师统计
 */
import React, { Component } from "react";
import ZoeHeader from "../../components/data/zoe-components/zoe-header";
import ZoeOrderNav from "../../components/data/zoe-components/zoe-orderNav";
import ZoeOrderMasCollege from "../../components/data/zoe-components/zoe-orderMasCollege";
import ZoeOrderMasTeacher from "../../components/data/zoe-components/zoe-orderMasTeacher";
import ZoeOrderMasAdm from "../../components/data/zoe-components/zoe-orderMasAdm";
import ZoeOrderMasRoom from "../../components/data/zoe-components/zoe-orderMasRoom";
import G from "../../../config/g";
import { ws_saveGlobalData } from '../../../redux/ws-global.reducer';
import {
  zoe_getMasSchRate,
  zoe_getMasColSta,
  zoe_getMasColRate,
  zoe_getMasTeaSta,
  zoe_getMasTeaRate,
  zoe_getMasAdmSta,
  zoe_getMasAdmRate,
  zoe_getMasRoomSta,
  //下载接口函数
  zoe_downMasColSta,
  zoe_downMasTeaSta,
  zoe_downMasAdmSta,
  zoe_downMasRoomSta
} from "../../../redux/zoe-dataOrder.reducer";
import { connect } from "react-redux";
@connect(state => ({ ...state.zoe_orderData, ...state.ws_global_reducer }), {
  zoe_getMasSchRate,
  zoe_getMasColSta,
  zoe_getMasColRate,
  zoe_getMasTeaSta,
  zoe_getMasTeaRate,
  zoe_getMasAdmSta,
  zoe_getMasAdmRate,
  zoe_getMasRoomSta,
  //下载接口函数
  zoe_downMasColSta,
  zoe_downMasTeaSta,
  zoe_downMasAdmSta,
  zoe_downMasRoomSta,
  ws_saveGlobalData
})
class OrderTeaData extends Component {
  constructor(props) {
    super(props);
    let tabArray = G.ISCED_tabArray || []
    let roleType = G.ISCED_curRoleInfo.roleType
    this.state = {
      curSign:
        tabArray.length
          ? (roleType==="1" || roleType === '2')
            ? tabArray.length : tabArray.length + 1
          : (roleType==="1" || roleType === '2')
            ? 1
            : 2, //校级账号展示开课单位统计 院级账号展示课程统计 展示 1开课单位  2课程 3教学班 4课堂
      orgName: tabArray.length && tabArray[tabArray.length - 1].orgName || G.ISCED_curRoleInfo.belongOrgName, //机构名称
      colRecord: {}, //点击的开课单位数据
      teaRecord: {}, //点击的教师数据
      claRecord: {}, //点击的教学班数据
      pinkInfo: {}, //头部筛选参数
      sort: {
        checkType: "",
        sortType: 0
      }, //表格排序参数
      pageNum: 1, //当前页
      pageSize: 20, //每页20条
      collegeId: tabArray.length 
        ? tabArray[tabArray.length - 1].collegeId 
        : (roleType==="1" || roleType === '2') 
          ? '' 
          : G.ISCED_curRoleInfo.belongOrgId, //开课单位id
      teacherId: tabArray.length && tabArray[tabArray.length - 1].teacherId || '', //教师id
      teaClaId: tabArray.length && tabArray[tabArray.length - 1].teaClaId || '',
      sortArr: [
        {
          checkType: "tea",
          sortType: 0
        },
        {
          checkType: "stu",
          sortType: 0
        },
        {
          checkType: "seat",
          sortType: 0
        },
        {
          checkType: "sleep",
          sortType: 0
        },
        {
          checkType: "disCla",
          sortType: 0
        }
      ]
    };
  }
  componentDidMount() { }


  componentWillReceiveProps(props) {
    // console.log(props)
    const { roleType, belongOrgName, belongOrgId } = G.ISCED_curRoleInfo;
    let { curSign } = this.state;
    // console.log(props.ISCED_tabArray.length)
    if (
      curSign !== 1
      && !(props.ISCED_tabArray && props.ISCED_tabArray.length)
      && this.state.orgName !== G.ISCED_curRoleInfo.belongOrgName
    ) {
      // console.log(props.ISCED_tabArray.length)
      this.setState({
        curSign: (roleType==="1" || roleType === '2') ? 1 : 2,
        orgName: belongOrgName,
        collegeId: belongOrgId
      })
    }
  }

  //修改当前展示标识
  getCurSign = (curSign, record) => {
    const { pinkInfo, sort, pageNum, pageSize, teacherId, collegeId } = this.state;
    const { roleType, belongOrgId, belongOrgName } = G.ISCED_curRoleInfo;
    this.node.scrollIntoView();
    console.log(record)
    this.setState({
      curSign,
      orgName:
        curSign === 1
          ? belongOrgName
          : curSign === 2
            ? (roleType==="1" || roleType === '2')
              ? record.collegeName
              : (roleType==="3" || roleType === '4')
                ? belongOrgName
                : ""
            : curSign === 3
              ? record.teacherName
              : curSign === 4
                ? record.teaClaName
                : ""
    });
    let array;
    if (roleType==="1" || roleType === '2') {
      array = [{
        collegeId: '',
        curSign: 1,
        ...pinkInfo,
        orgName: belongOrgName
      }]
    } else {
      array = [{
        collegeId: belongOrgId,
        curSign: 2,
        ...pinkInfo,
        orgName: belongOrgName
      }]
    }
    if (G.ISCED_tabArray.length) {
      array = G.ISCED_tabArray
    }
    let obj;//存储每一层级数据
    if (curSign === 1) {
      this.setState({
        collegeId: ""
      });
      //调获取统计率的接口函数
      // this.props.zoe_getMasSchRate({ ...pinkInfo });
      //调获取统计列表接口
      this.props.zoe_getMasColSta({ ...pinkInfo, ...sort, collegeId: "" });
      obj = {
        ...pinkInfo,
        collegeId: '',
        curSign,
        orgName: belongOrgName

      }
    }
    if (curSign === 2) {
      if (roleType==="1" || roleType === '2') {
        this.setState({
          colRecord: record, //点击的开课单位数据
          collegeId: record.collegeId,
          teacherId: "",
          pageNum: 1
        });
        //表示当前点击的开课单位
        //调获取开课单位的统计率
        //调获取教师的统计列表
        this.props.zoe_getMasColRate({
          ...pinkInfo,
          collegeId: record.collegeId
        });
        this.props.zoe_getMasTeaSta({
          ...pinkInfo,
          collegeId: record.collegeId,
          ...sort,
          pageNum: 1,
          pageSize,
          teacherId: ""
        });
        obj = {
          ...pinkInfo,
          collegeId: record.collegeId,
          ...sort,
          pageNum: 1,
          pageSize,
          curSign,
          courseId: "",
          orgName: record.collegeName
        }
      } else {
        this.setState({
          collegeId: belongOrgId,
          teacherId: "",
          pageNum: 1
        });
        //表示当前点击的开课单位
        //调获取开课单位的统计率
        //调获取教师的统计列表
        this.props.zoe_getMasColRate({
          ...pinkInfo,
          collegeId: belongOrgId
        });
        this.props.zoe_getMasTeaSta({
          ...pinkInfo,
          collegeId: belongOrgId,
          ...sort,
          pageNum: 1,
          pageSize,
          teacherId: ""
        });
        obj = {
          ...pinkInfo,
          collegeId: belongOrgId,
          ...sort,
          curSign,
          pageNum: 1,
          pageSize,
          teacherId: "",
          orgName: (roleType==="3" || roleType === '4') ? belongOrgName : ''
        }
      }
    }
    if (curSign === 3) {
      this.setState({
        teaRecord: record, //点击的教师数据
        teacherId: record.teacherId,
        pageNum: 1
      });
      //表示当前点击的教师
      //调获取教师的统计率
      //调获取教学班的统计列表
      this.props.zoe_getMasTeaRate({
        ...pinkInfo,
        teacherId: record.teacherId,
        collegeId: array[array.length - 1].collegeId
      });
      this.props.zoe_getMasAdmSta({
        ...pinkInfo,
        teacherId: record.teacherId,
        collegeId: array[array.length - 1].collegeId,
        ...sort,
        pageNum: 1,
        pageSize
      });
      obj = {
        ...pinkInfo,
        ...sort,
        curSign,
        teacherId: record.teacherId,
        collegeId: array[array.length - 1].collegeId,
        pageNum: 1,
        pageSize,
        orgName: record.teacherName
      }
    }
    if (curSign === 4) {
      this.setState({
        claRecord: record, //点击的教学班数据
        teaClaId: record.teaClaId,
        pageNum: 1
      });
      //表示当前点击的课堂
      //调获取教学班的统计率
      //调获取课堂的统计列表
      this.props.zoe_getMasAdmRate({
        ...pinkInfo,
        collegeId: array[array.length - 1].collegeId,
        teaClaId: record.teaClaId
      });
      this.props.zoe_getMasRoomSta({
        ...pinkInfo,
        teaClaId: record.teaClaId,
        collegeId: array[array.length - 1].collegeId,
        ...sort,
        pageNum: 1,
        pageSize
      });
      obj = {
        ...pinkInfo,
        teaClaId: record.teaClaId,
        collegeId: array[array.length - 1].collegeId,
        curSign,
        ...sort,
        pageNum: 1,
        pageSize,
        orgName: record.teaClaName
      }
    }
    array.push(obj)
    this.props.ws_saveGlobalData(array, 'ISCED_tabArray')
  };

  // 获取头部筛选参数
  getHeaderParams = pinkInfo => {
    const { sort, curSign, collegeId, teaClaId, teacherId, pageNum, pageSize } = this.state;
    const { roleType, belongOrgId } = G.ISCED_curRoleInfo;
    let curSignArray = G.ISCED_tabArray || []
    this.setState({
      pinkInfo
    });
    console.log(curSign)
    // if (roleType==="1" || roleType === '2') {
    //   //调获取统计率的接口函数
    //   this.props.zoe_getMasSchRate({ ...pinkInfo });
    //   //调获取统计列表接口
    //   this.props.zoe_getMasColSta({ ...pinkInfo, ...sort, collegeId });
    // } else {
    //   this.setState({
    //     collegeId: belongOrgId
    //   })
    //   //调获取开课单位的统计率
    //   //调获取教师的统计列表
    //   this.props.zoe_getMasColRate({
    //     ...pinkInfo,
    //     collegeId: belongOrgId
    //   });
    //   this.props.zoe_getMasTeaSta({
    //     ...pinkInfo,
    //     collegeId: belongOrgId,
    //     ...sort,
    //     pageNum,
    //     pageSize,
    //     teacherId
    //   });
    // }
    if (roleType==="1" || roleType === '2') {
      if (curSignArray.length <= 1) {
        //调获取统计率的接口函数
        this.props.zoe_getMasSchRate({ ...pinkInfo });
        //调获取统计列表接口
        this.props.zoe_getMasColSta({ ...pinkInfo, ...sort, collegeId });
      }
      if (curSignArray.length == 2) {
        //表示当前点击的开课单位
        //调获取开课单位的统计率
        //调获取教师的统计列表
        this.props.zoe_getMasColRate({
          ...pinkInfo,
          collegeId
        });
        this.props.zoe_getMasTeaSta({
          ...pinkInfo,
          collegeId,
          ...sort,
          pageNum: 1,
          pageSize,
          teacherId: ""
        });

      }
      if (curSignArray.length === 3) {
        //表示当前点击的教师
        //调获取教师的统计率
        //调获取教学班的统计列表
        this.props.zoe_getMasTeaRate({
          ...pinkInfo,
          teacherId,
          collegeId
        });
        this.props.zoe_getMasAdmSta({
          ...pinkInfo,
          teacherId,
          collegeId,
          ...sort,
          pageNum: 1,
          pageSize
        });
      }
      if (curSignArray.length === 4) {
        //表示当前点击的课堂
        //调获取教学班的统计率
        //调获取课堂的统计列表
        this.props.zoe_getMasAdmRate({
          ...pinkInfo,
          collegeId,
          teaClaId
        });
        this.props.zoe_getMasRoomSta({
          ...pinkInfo,
          teaClaId,
          collegeId,
          ...sort,
          pageNum: 1,
          pageSize
        });
      }
    } else {
      if (curSign === 2) {
        //表示当前点击的开课单位
        //调获取开课单位的统计率
        //调获取教师的统计列表
        this.props.zoe_getMasColRate({
          ...pinkInfo,
          collegeId: belongOrgId
        });
        this.props.zoe_getMasTeaSta({
          ...pinkInfo,
          collegeId: belongOrgId,
          ...sort,
          pageNum: 1,
          pageSize,
          teacherId
        });

      }
      if (curSign === 3) {
        //表示当前点击的教师
        //调获取教师的统计率
        //调获取教学班的统计列表
        this.props.zoe_getMasTeaRate({
          ...pinkInfo,
          teacherId,
          collegeId: belongOrgId
        });
        this.props.zoe_getMasAdmSta({
          ...pinkInfo,
          teacherId,
          collegeId: belongOrgId,
          ...sort,
          pageNum: 1,
          pageSize
        });
      }
      if (curSign === 4) {
        //表示当前点击的课堂
        //调获取教学班的统计率
        //调获取课堂的统计列表
        this.props.zoe_getMasAdmRate({
          ...pinkInfo,
          collegeId: belongOrgId,
          teaClaId
        });
        this.props.zoe_getMasRoomSta({
          ...pinkInfo,
          teaClaId,
          collegeId: belongOrgId,
          ...sort,
          pageNum: 1,
          pageSize
        });
      }
      this.setState({
        collegeId: belongOrgId
      })
    }

  };
  //只改变当前位置
  changeSign = curSign => {
    const {
      colRecord,
      teaRecord,
      claRecord,
      collegeId,
      pageSize,
      sort,
      pinkInfo,
      teacherId,
      teaClaId
    } = this.state;
    const { roleType, belongOrgId, belongOrgName } = G.ISCED_curRoleInfo;
    this.node.scrollIntoView();
    this.setState({
      curSign,
      orgName:
        curSign === 4
          ? claRecord.teaClaName
          : curSign === 3
            ? teaRecord.teacherName
            : curSign === 2
              ? (roleType==="1" || roleType === '2')
                ? colRecord.collegeName
                : (roleType==="3" || roleType === '4')
                  ? belongOrgName
                  : ""
              : curSign === 1
                ? belongOrgName
                : ""
    });
    let array = G.ISCED_tabArray || []
    let array1 = (roleType==="1" || roleType === '2') ? array.slice(0, curSign) : array.slice(0, curSign - 1)
    this.props.ws_saveGlobalData(array1, 'ISCED_tabArray')
    console.log(array1)
    if (roleType==="1" || roleType === '2') {
      if (array1.length === 1) {
        //在返回到开课单位统计的时候要清掉开课单位数据 同时重新请求开课单位数据
        this.setState({
          collegeId: "",
          teacherId: "",
          orgName: array1[0].orgName
        });
        //调获取统计率的接口函数
        this.props.zoe_getMasSchRate({ ...pinkInfo });
        //调获取统计列表接口
        this.props.zoe_getMasColSta({
          ...pinkInfo,
          ...sort,
          collegeId: ""
        });
      }
      if (array1.length === 2) {
        //只有当前在3 或4 的时候才有可能返回到2
        this.setState({
          pageNum: 1,
          teacherId: "",
          orgName: array1[1].orgName
        });
        //调获取开课单位的统计率
        //调获取教师的统计列表
        this.props.zoe_getMasColRate({
          ...pinkInfo,
          collegeId: array1[1].collegeId
        });
        this.props.zoe_getMasTeaSta({
          ...pinkInfo,
          collegeId: array1[1].collegeId,
          ...sort,
          pageNum: 1,
          pageSize,
          teacherId: ""
        });
      }
      if (array1.length === 3) {
        //当前是在4的状态下返回到3 所以重新请求3的数据
        this.setState({
          pageNum: 1,
          orgName: array1[2].orgName
        });
        //表示当前点击的教师
        //调获取课程的统计率
        //调获取教学班的统计列表
        this.props.zoe_getMasTeaRate({
          ...pinkInfo,
          teacherId: array1[2].teacherId,
          collegeId: array1[2].collegeId
        });
        this.props.zoe_getMasAdmSta({
          ...pinkInfo,
          teacherId: array1[2].teacherId,
          collegeId: array1[2].collegeId,
          ...sort,
          pageNum: 1,
          pageSize
        });
      }
    } else {
      if (array1.length === 1) {
        //在返回到开课单位统计的时候要清掉开课单位数据 同时重新请求开课单位数据
        this.setState({
          collegeId: "",
          teacherId: "",
          orgName: array1[0].orgName
        });
        // //调获取统计率的接口函数
        // this.props.zoe_getMasSchRate({ ...pinkInfo, collegeId: array1[0].collegeId });
        // //调获取统计列表接口
        // this.props.zoe_getMasColSta({
        //   ...pinkInfo,
        //   ...sort,
        //   collegeId: array1[0].collegeId
        // });
        //调获取教师的统计列表
        this.props.zoe_getMasColRate({
          ...pinkInfo,
          collegeId: array1[0].collegeId
        });
        this.props.zoe_getMasTeaSta({
          ...pinkInfo,
          collegeId: array1[0].collegeId,
          ...sort,
          pageNum: 1,
          pageSize,
          teacherId: ""
        });
      }
      if (array1.length === 2) {
        //只有当前在3 或4 的时候才有可能返回到2
        this.setState({
          pageNum: 1,
          teacherId: "",
          orgName: array1[1].orgName
        });

        //调获取教学班的统计列表
        this.props.zoe_getMasTeaRate({
          ...pinkInfo,
          teacherId: array1[1].teacherId,
          collegeId: array1[1].collegeId
        });
        this.props.zoe_getMasAdmSta({
          ...pinkInfo,
          teacherId: array1[1].teacherId,
          collegeId: array1[1].collegeId,
          ...sort,
          pageNum: 1,
          pageSize
        });
      }
    }
  };
  //获取表格排序参数
  getSortParams = sort => {
    const {
      pinkInfo,
      curSign,
      collegeId,
      teacherId,
      teaClaId,
      pageSize,
      pageNum
    } = this.state;
    this.setState({
      sort
    });
    if (curSign === 1) {
      //开课单位统计
      this.props.zoe_getMasColSta({ ...pinkInfo, ...sort, collegeId });
    } else if (curSign === 2) {
      //教师统计
      this.props.zoe_getMasTeaSta({
        ...pinkInfo,
        collegeId,
        ...sort,
        pageNum,
        pageSize,
        teacherId
      });
    } else if (curSign === 3) {
      //教学班统计
      this.props.zoe_getMasAdmSta({
        ...pinkInfo,
        teacherId,
        collegeId,
        ...sort,
        pageNum,
        pageSize
      });
    } else if (curSign === 4) {
      //课堂统计
      this.props.zoe_getMasRoomSta({
        ...pinkInfo,
        teaClaId,
        collegeId,
        ...sort,
        pageNum,
        pageSize
      });
    }
  };
  //获取开课单位id 从搜索下拉开课单位列表里获取
  getCollegeId = collegeId => {
    const { pinkInfo, sort } = this.state;
    this.node.scrollIntoView();
    this.setState({
      collegeId
    });
    //选择了开课单位之后需要重新调列表统计接口
    this.props.zoe_getMasColSta({ ...pinkInfo, ...sort, collegeId });
  };
  // 获取教师id 从搜索下拉课程列表里获取
  getTeacherId = teacherId => {
    const { pinkInfo, sort, collegeId, pageNum, pageSize } = this.state;
    // console.log('collegeId',collegeId)
    this.node ? this.node.scrollIntoView() : null;
    this.setState({
      teacherId
    });
    this.props.zoe_getMasTeaSta({
      ...pinkInfo,
      collegeId,
      ...sort,
      pageNum,
      pageSize,
      teacherId
    });

  };
  // 下载函数
  downLoad = () => {
    const {
      pinkInfo,
      sort,
      curSign,
      colRecord,
      teaRecord,
      claRecord,
      collegeId,
      teacherId,
      teaClaId
    } = this.state;
    if (curSign === 1) {
      this.props.zoe_downMasColSta({ ...pinkInfo, ...sort, collegeId });
    } else if (curSign === 2) {
      this.props.zoe_downMasTeaSta({
        ...pinkInfo,
        ...sort,
        collegeId,
        teacherId
      });
    } else if (curSign === 3) {
      this.props.zoe_downMasAdmSta({
        ...pinkInfo,
        ...sort,
        collegeId,
        teacherId
      });
    } else if (curSign === 4) {
      this.props.zoe_downMasRoomSta({
        ...pinkInfo,
        teaClaId,
        collegeId,
        ...sort
      });
    }
  };
  // 重置表格排序标识
  changeReset = () => {
    this.setState({
      sortArr: [
        {
          checkType: "tea",
          sortType: 0
        },
        {
          checkType: "stu",
          sortType: 0
        },
        {
          checkType: "seat",
          sortType: 0
        },
        {
          checkType: "sleep",
          sortType: 0
        },
        {
          checkType: "disCla",
          sortType: 0
        }
      ],
      sort: {
        checkType: "",
        sortType: 0
      }
    });
  };
  // 获取分页参数
  getPageNum = pageNum => {
    this.setState({
      pageNum
    });
    const {
      pinkInfo,
      curSign,
      collegeId,
      teacherId,
      teaClaId,
      pageSize,
      sort
    } = this.state;
    this.node.scrollIntoView();
    if (curSign === 1) {
      //开课单位统计
      this.setState({
        pageNum: 1
      });
    } else if (curSign === 2) {
      //教师统计
      this.props.zoe_getMasTeaSta({
        ...pinkInfo,
        collegeId,
        ...sort,
        pageNum,
        pageSize,
        teacherId
      });
    } else if (curSign === 3) {
      //教学班统计
      this.props.zoe_getMasAdmSta({
        ...pinkInfo,
        teacherId,
        collegeId,
        ...sort,
        pageNum,
        pageSize
      });
    } else if (curSign === 4) {
      //课堂统计
      this.props.zoe_getMasRoomSta({
        ...pinkInfo,
        teaClaId,
        collegeId,
        ...sort,
        pageNum,
        pageSize
      });
    }
  };
  //排序函数
  setSort = (checkType, sortType) => {
    const { sortArr, pickInfo, page, pageNum } = this.state;
    sortArr.map(item => {
      if (item.checkType === checkType) {
        if (item.sortType === sortType) {
          item.sortType = 0;
          checkType = "";
        } else {
          item.sortType = sortType;
        }
      } else {
        item.sortType = 0;
      }
    });
    this.setState(
      {
        sortArr,
        checkType,
        sortType
      },
      () => {
        this.getSortParams({ checkType, sortType });
      }
    );
  };
  // 获取教师统计dom
  getOrderMasDom = () => {
    const {
      curSign,
      pinkInfo,
      collegeId,
      teacherId,
      pageSize,
      pageNum,
      sortArr
    } = this.state;
    let curSignArray = G.ISCED_tabArray || []
    const { roleType } = G.ISCED_curRoleInfo;
    if (roleType==="1" || roleType === '2') {
      switch (curSignArray.length) {
        case 0:
        case 1:
          return (
            <ZoeOrderMasCollege
              collegeId={collegeId}
              teacherId={teacherId}
              pinkInfo={pinkInfo}
              sortArr={sortArr}
              pageNum={pageNum}
              curSign={curSign}
              pageSize={pageSize}
              getTeacherId={this.getTeacherId}
              getCollegeId={this.getCollegeId}
              getCurSign={this.getCurSign}
              downLoad={this.downLoad}
              getPageNum={this.getPageNum}
              setSort={this.setSort}
            />
          );
        case 2:
          return (
            <ZoeOrderMasTeacher
              collegeId={collegeId}
              teacherId={teacherId}
              pinkInfo={pinkInfo}
              sortArr={sortArr}
              curSign={curSign}
              pageNum={pageNum}
              pageSize={pageSize}
              getTeacherId={this.getTeacherId}
              getCollegeId={this.getCollegeId}
              getCurSign={this.getCurSign}
              downLoad={this.downLoad}
              getPageNum={this.getPageNum}
              setSort={this.setSort}
            />
          );
        case 3:
          return (
            <ZoeOrderMasAdm
              collegeId={collegeId}
              teacherId={teacherId}
              pinkInfo={pinkInfo}
              sortArr={sortArr}
              pageNum={pageNum}
              curSign={curSign}
              pageSize={pageSize}
              downLoad={this.downLoad}
              getCurSign={this.getCurSign}
              getPageNum={this.getPageNum}
              setSort={this.setSort}
            />
          );
        case 4:
          return (
            <ZoeOrderMasRoom
              collegeId={collegeId}
              teacherId={teacherId}
              pinkInfo={pinkInfo}
              sortArr={sortArr}
              pageNum={pageNum}
              curSign={curSign}
              pageSize={pageSize}
              downLoad={this.downLoad}
              getCurSign={this.getCurSign}
              getPageNum={this.getPageNum}
              setSort={this.setSort}
              history={this.props.history}
            />
          );
      }
    } else {
      switch (curSignArray.length) {
        case 0:
        case 1:
          return (
            <ZoeOrderMasTeacher
              collegeId={collegeId}
              teacherId={teacherId}
              pinkInfo={pinkInfo}
              sortArr={sortArr}
              curSign={curSign}
              pageNum={pageNum}
              pageSize={pageSize}
              getTeacherId={this.getTeacherId}
              getCollegeId={this.getCollegeId}
              getCurSign={this.getCurSign}
              downLoad={this.downLoad}
              getPageNum={this.getPageNum}
              setSort={this.setSort}
            />
          );
        case 2:
          return (
            <ZoeOrderMasAdm
              collegeId={collegeId}
              teacherId={teacherId}
              pinkInfo={pinkInfo}
              sortArr={sortArr}
              pageNum={pageNum}
              curSign={curSign}
              pageSize={pageSize}
              downLoad={this.downLoad}
              getCurSign={this.getCurSign}
              getPageNum={this.getPageNum}
              setSort={this.setSort}
            />
          );
        case 3:
          return (
            <ZoeOrderMasRoom
              collegeId={collegeId}
              teacherId={teacherId}
              pinkInfo={pinkInfo}
              sortArr={sortArr}
              pageNum={pageNum}
              curSign={curSign}
              pageSize={pageSize}
              downLoad={this.downLoad}
              getCurSign={this.getCurSign}
              getPageNum={this.getPageNum}
              setSort={this.setSort}
              history={this.props.history}
            />
          );

      }
    }

  };
  render() {
    const { curSign, colRecord, teaRecord, claRecord, orgName, collegeId } = this.state;
    return (
      <div
        style={{
          background: "#fff",
          width: "calc(100% - 40px)",
          minHeight: "calc(100% - 20px)",
          margin: "0 20px 20px 20px"
        }}
        ref={node => {
          this.node = node;
        }}
      >
        <ZoeOrderNav
          pageType={2}
          curSign={curSign}
          getCurSign={this.getCurSign}
          changeSign={this.changeSign}
          record={{ colRecord, teaRecord, claRecord }}
        />
        <div className="zoe-data-container">
          <ZoeHeader
            pageType="1"
            curSign={curSign}
            getHeaderParams={this.getHeaderParams}
            changeReset={this.changeReset}
          />
          <div
            style={{
              width: "100%",
              height: "calc(100% - 75px)",
              padding: "20px"
            }}
          >
            <div style={{ height: 45, fontSize: 20 }}>{orgName}</div>
            {this.getOrderMasDom()}
          </div>
        </div>
      </div>
    );
  }
}

export default OrderTeaData;

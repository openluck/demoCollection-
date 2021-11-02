/*
 * @Author: lxx
 * @Date: 2020-01-23 09:31:51
 * @Last Modified by: tj
 * @Last Modified time: 2020-08-06 16:07:29
 * 教学秩序-课程统计
 */
import React, { Component } from "react";
import "../../../style/zoe-data.scss";
import ZoeOrderNav from "../../components/data/zoe-components/zoe-orderNav";
import ZoeHeader from "../../components/data/zoe-components/zoe-header";
import ZoeOrderClaCollege from "../../components/data/zoe-components/zoe-orderClaCollege";
import ZoeOrderClaCourse from "../../components/data/zoe-components/zoe-orderClaCourse";
import ZoeOrderClaAdm from "../../components/data/zoe-components/zoe-orderClaAdm";
import ZoeOrderClaRoom from "../../components/data/zoe-components/zoe-orderClaRoom";
import { lxx_saveInfo, ws_saveGlobalData } from '../../../redux/ws-global.reducer';
import G from "../../../config/g";
import { withRouter } from 'react-router-dom';
import {
  zoe_getClaSchRate,
  zoe_getClaColSta,
  zoe_getClaColRate,
  zoe_getClaCourSta,
  zoe_getClaCourRate,
  zoe_getClaAdmSta,
  zoe_getClaRoomRate,
  zoe_getClaRoomSta,
  //下载接口函数
  zoe_downClaColSta,
  zoe_downClaCourSta,
  zoe_downClaAdmSta,
  zoe_downClaRoomSta
} from "../../../redux/zoe-dataOrder.reducer";
import { connect } from "react-redux";
import ZoeCollege from "../../components/data/zoe-components/zoe-orderClaCollege";
@withRouter
@connect(state => ({ ...state.zoe_orderData, ...state.ws_global_reducer }), {
  zoe_getClaSchRate,
  zoe_getClaColSta,
  zoe_getClaColRate,
  zoe_getClaCourSta,
  zoe_getClaCourRate,
  zoe_getClaAdmSta,
  zoe_getClaRoomRate,
  zoe_getClaRoomSta,
  //下载接口函数
  zoe_downClaColSta,
  zoe_downClaCourSta,
  zoe_downClaAdmSta,
  zoe_downClaRoomSta,
  //菜单点击 将当前页置为首页 curSign置为1 或 2
  lxx_saveInfo,
  ws_saveGlobalData
})
class OrderCourseData extends Component {
  constructor(props) {
    super(props);
    // let tabArray=JSON.parse(sessionStorage.getItem('tabArray'))||[];
    let tabArray = G.ISCED_tabArray || []
    let roleType = G.ISCED_curRoleInfo.roleType
    this.state = {
      curSign: tabArray.length
        ? (roleType==="1" || roleType === '2')
          ? tabArray.length
          : tabArray.length + 1
        : (roleType==="1" || roleType === '2')
          ? 1 : 2, //校级账号展示开课单位统计 院级账号展示课程统计 展示 1开课单位  2课程 3教学班 4课堂
      orgName: tabArray.length && tabArray[tabArray.length - 1].orgName || G.ISCED_curRoleInfo.belongOrgName, //机构名称
      colRecord: {}, //点击的开课单位数据
      courRecord: {}, //点击的课程数据
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
          ? '' : G.ISCED_curRoleInfo.belongOrgId, //开课单位id
      courseId: tabArray.length && tabArray[tabArray.length - 1].courseId || '', //课程id
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
      ],
      ifNew: true,//是否为刷新
      tabArray: sessionStorage.getItem('tabArray') ?
        JSON.parse(sessionStorage.getItem('tabArray')) : []

    };
  }
  componentDidMount() {
    console.log(111)
  }

  componentWillReceiveProps(props) {
    console.log("props", props)
    const { roleType, belongOrgName, belongOrgId } = G.ISCED_curRoleInfo;
    let { curSign, collegeId } = this.state;
    // console.log('length',props.ISCED_tabArray.length)
    if (curSign !== 1
      && !(props.ISCED_tabArray && props.ISCED_tabArray.length)
      && this.state.orgName !== G.ISCED_curRoleInfo.belongOrgName
    ) {
      // 返回，机构名称变更
      // console.log(props.ISCED_tabArray.length)
      this.setState({
        curSign: (roleType === "1" || roleType === '2') ? 1 : 2,
        orgName: belongOrgName,
        collegeId: belongOrgId
      })
    }
    // else if(curSign === 1 && !(props.ISCED_tabArray && props.ISCED_tabArray.length) && collegeId ) {
    //   // 层级返回校级，清空机构选中id
    //   this.setState({
    //     collegeId: ''
    //   })
    // }
  }
  //监听菜单点击标识  并将当前页置为首页
  // componentWillReceiveProps(prop) {
  //   const {roleType}=G.ISCED_curRoleInfo
  //   const {ISCED_saveInfo,pinkInfo}=prop
  //   const {curSign,ifNew,sort,collegeId}=this.state
  //   console.log('ifNew',ifNew)
  //   console.log('ISCED_saveInfo',ISCED_saveInfo)
  //   if (!ifNew&&ISCED_saveInfo==="1") {
  //    if(roleType==="1" || roleType === '2'){
  //     //当前为校级
  //     //调获取统计率的接口函数
  //     this.props.zoe_getClaSchRate({ ...pinkInfo });
  //     //调获取统计列表接口
  //     this.props.zoe_getClaColSta({ ...pinkInfo, ...sort, collegeId });
  //    }
  //    if(roleId==="1"){

  //    }
  //   }
  // }

  //修改当前展示标识
  getCurSign = (curSign, record) => {
    console.log(curSign, record)
    const { pinkInfo, sort, pageNum, pageSize, courseId, collegeId } = this.state;
    const { roleType, belongOrgId, belongOrgName } = G.ISCED_curRoleInfo;
    this.node.scrollIntoView(); //页面滚动函数-调用它的元素 滚动到浏览器窗口的可见区域
    this.setState({
      curSign: curSign,
      orgName:
        curSign === 1
          ? belongOrgName
          : curSign === 2
            ? ((roleType === "1" || roleType === '2')
              ? record.collegeName
              : (roleType === "3" || roleType === '4')
                ? belongOrgName
                : '')
            : curSign === 3
              ? record.courseName
              : curSign === 4
                ? record.teaClaName
                : ""
    });
    let array;
    if (roleType === "1" || roleType === '2') {
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
    // if (JSON.parse(sessionStorage.getItem('tabArray'))) {
    //   array = JSON.parse(sessionStorage.getItem('tabArray'))
    // }
    let obj;
    if (curSign === 1) {
      this.setState({
        collegeId: ""
      });
      //调获取统计率的接口函数
      // this.props.zoe_getClaSchRate({ ...pinkInfo });
      //调获取统计列表接口
      this.props.zoe_getClaColSta({ ...pinkInfo, ...sort, collegeId: "" });
      obj = {
        ...pinkInfo,
        collegeId: '',
        curSign,
        orgName: belongOrgName

      }
    }
    if (curSign === 2) {
      if (roleType === "1" || roleType === '2') {
        //校级的时候要清掉courseId 院级不用
        this.setState({
          colRecord: record, //点击的开课单位数据
          collegeId: record.collegeId,
          courseId: "",
          pageNum: 1,
          // ifNew:false,
        });
        // this.props.lxx_saveInfo("2")
        //表示当前点击的开课单位
        //调获取开课单位的统计率
        //调获取课程的统计列表
        this.props.zoe_getClaColRate({
          ...pinkInfo,
          collegeId: record.collegeId
        });
        this.props.zoe_getClaCourSta({
          ...pinkInfo,
          collegeId: record.collegeId,
          ...sort,
          pageNum: 1,
          pageSize,
          courseId: ""
        });
        obj = {
          ...pinkInfo,
          collegeId: record.collegeId,
          ...sort,
          pageNum: 1,
          pageSize,
          curSign,
          courseId: "",
          orgName: (roleType === "1" || roleType === '2')
            ? record.collegeName
            : (roleType === "3" || roleType === '4')
              ? belongOrgName
              : ''
        }

      } else {
        this.setState({
          collegeId: belongOrgId,
          courseId: "",
          pageNum: 1,
        });
        //表示当前点击的开课单位
        //调获取开课单位的统计率
        //调获取课程的统计列表
        this.props.zoe_getClaColRate({
          ...pinkInfo,
          collegeId: belongOrgId
        });
        this.props.zoe_getClaCourSta({
          ...pinkInfo,
          collegeId: belongOrgId,
          ...sort,
          pageNum: 1,
          pageSize,
          courseId: ""
        });
        obj = {
          ...pinkInfo,
          collegeId: belongOrgId,
          ...sort,
          curSign,
          pageNum: 1,
          pageSize,
          courseId: "",
          orgName: (roleType === "1" || roleType === '2')
            ? record.collegeName
            : (roleType === "1" || roleType === '2')
              ? belongOrgName
              : ''
        }
      }
    }
    if (curSign === 3) {
      this.setState({
        courRecord: record, //点击的课程数据
        courseId: record.courseId,
        pageNum: 1
      });

      //表示当前点击的课程
      //调获取课程的统计率
      //调获取教学班的统计列表
      this.props.zoe_getClaCourRate({
        ...pinkInfo,
        courseId: record.courseId,
        collegeId: array[array.length - 1].collegeId
      });

      this.props.zoe_getClaAdmSta({
        ...pinkInfo,
        courseId: record.courseId,
        ...sort,
        collegeId: array[array.length - 1].collegeId,
        pageNum: 1,
        pageSize
      });
      obj = {
        ...pinkInfo,
        courseId: record.courseId,
        ...sort,
        curSign,
        collegeId: array[array.length - 1].collegeId,
        pageNum: 1,
        pageSize,
        orgName: record.courseName
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
      this.props.zoe_getClaRoomRate({
        ...pinkInfo,
        collegeId: array[array.length - 1].collegeId,
        teaClaId: record.teaClaId
      });
      this.props.zoe_getClaRoomSta({
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
    // sessionStorage.setItem('tabArray', JSON.stringify(array))
  };
  //只改变当前位置
  changeSign = curSign => {
    const {
      colRecord,
      courRecord,
      claRecord,
      collegeId,
      pageSize,
      sort,
      pinkInfo,
      courseId
    } = this.state;
    const { roleType, belongOrgId, belongOrgName } = G.ISCED_curRoleInfo;
    this.node.scrollIntoView();
    this.setState({
      curSign,
      orgName:
        curSign === 4
          ? claRecord.teaClaName
          : curSign === 3
            ? courRecord.courseName
            : curSign === 2
              ? ((roleType === "1" || roleType === '2')
                ? colRecord.collegeName
                : (roleType === "3" || roleType === '4')
                  ? belongOrgName
                  : '')
              : curSign === 1
                ? belongOrgName
                : ""
    });
    // let array = JSON.parse(sessionStorage.getItem('tabArray')) || []
    let array = G.ISCED_tabArray || []
    let array1 = (roleType==="1" || roleType === '2') ? array.slice(0, curSign) : array.slice(0, curSign - 1)
    // sessionStorage.setItem('tabArray', JSON.stringify(array1))
    this.props.ws_saveGlobalData(array1, 'ISCED_tabArray')
    console.log(array1)
    if (roleType==="1" || roleType === '2') { //校级账号
      if (array1.length == 1) {
        //在返回到开课单位统计的时候要清掉开课单位数据 同时重新请求开课单位数据
        this.setState({
          collegeId: "",
          courseId: "",
          orgName: array1[0].orgName
        });
        //调获取统计率的接口函数
        this.props.zoe_getClaSchRate({ ...pinkInfo });
        //调获取统计列表接口
        this.props.zoe_getClaColSta({
          ...pinkInfo,
          ...sort,
          collegeId: ""
        });
      }
      if (array1.length == 2) {
        //只有当前在3 或4 的时候才有可能返回到2
        this.setState({
          pageNum: 1,
          courseId: "",
          orgName: array1[1].orgName
        });
        //表示当前点击的开课单位
        //调获取开课单位的统计率
        //调获取课程的统计列表
        this.props.zoe_getClaColRate({
          ...pinkInfo,
          collegeId: array1[1].collegeId
        });
        this.props.zoe_getClaCourSta({
          ...pinkInfo,
          collegeId: array1[1].collegeId,
          ...sort,
          pageNum: 1,
          pageSize,
          courseId: ""
        });
      }
      if (array1.length == 3) {
        //当前是在4的状态下返回到3 所以重新请求3的数据
        this.setState({
          pageNum: 1,
          orgName: array1[2].orgName
        });
        //表示当前点击的课程
        //调获取课程的统计率
        //调获取教学班的统计列表
        this.props.zoe_getClaCourRate({
          ...pinkInfo,
          courseId: array1[2].courseId,
          collegeId: array1[2].collegeId,
        });
        this.props.zoe_getClaAdmSta({
          ...pinkInfo,
          courseId: array1[2].courseId,
          collegeId: array1[2].collegeId,
          ...sort,
          pageNum: 1,
          pageSize
        });
      }
    } else { //院级账号
      if (array1.length == 1) {
        //在返回到开课单位统计的时候要清掉开课单位数据 同时重新请求开课单位数据
        this.setState({
          collegeId: "",
          pageNum: 1,
          courseId: "",
          orgName: array1[0].orgName
        });
        this.props.zoe_getClaColRate({
          ...pinkInfo,
          collegeId: array1[0].collegeId
        });
        this.props.zoe_getClaCourSta({
          ...pinkInfo,
          collegeId: array1[0].collegeId,
          ...sort,
          pageNum: 1,
          pageSize,
          courseId: ""
        });
      }
      if (array1.length == 2) {
        //只有当前在3 或4 的时候才有可能返回到2
        this.setState({
          pageNum: 1,
          courseId: "",
          orgName: array1[1].orgName
        });
        //调获取教学班的统计列表
        this.props.zoe_getClaCourRate({
          ...pinkInfo,
          courseId: array1[1].courseId,
          collegeId: array1[1].collegeId,
        });
        this.props.zoe_getClaAdmSta({
          ...pinkInfo,
          courseId: array1[1].courseId,
          collegeId: array1[1].collegeId,
          ...sort,
          pageNum: 1,
          pageSize
        });
      }
    }

    // if (curSign === 1) {
    //   //在返回到开课单位统计的时候要清掉开课单位数据 同时重新请求开课单位数据
    //   this.setState({
    //     collegeId: "",
    //     courseId: ""
    //   });
    //   //调获取统计率的接口函数
    //   // this.props.zoe_getClaSchRate({ ...pinkInfo });
    //   //调获取统计列表接口
    //   this.props.zoe_getClaColSta({
    //     ...pinkInfo,
    //     ...sort,
    //     collegeId: ""
    //   });
    // }
    // if (curSign === 2) {
    //   //只有当前在3 或4 的时候才有可能返回到2
    //   this.setState({
    //     pageNum: 1,
    //     courseId: ""
    //   });
    //   //表示当前点击的开课单位
    //   //调获取开课单位的统计率
    //   //调获取课程的统计列表
    //   this.props.zoe_getClaColRate({
    //     ...pinkInfo,
    //     collegeId
    //   });
    //   this.props.zoe_getClaCourSta({
    //     ...pinkInfo,
    //     collegeId,
    //     ...sort,
    //     pageNum: 1,
    //     pageSize,
    //     courseId: ""
    //   });

    // }
    // if (curSign === 3) {
    //   //当前是在4的状态下返回到3 所以重新请求3的数据
    //   this.setState({
    //     pageNum: 1
    //   });
    //   //表示当前点击的课程
    //   //调获取课程的统计率
    //   //调获取教学班的统计列表
    //   this.props.zoe_getClaCourRate({
    //     ...pinkInfo,
    //     courseId,
    //     collegeId
    //   });
    //   this.props.zoe_getClaAdmSta({
    //     ...pinkInfo,
    //     courseId,
    //     collegeId,
    //     ...sort,
    //     pageNum: 1,
    //     pageSize
    //   });
    // }
  };
  // 获取头部筛选参数
  getHeaderParams = pinkInfo => {
    const { sort, curSign, collegeId, pageNum, pageSize, courseId, teaClaId } = this.state;
    // console.log(this.state, curSign)
    const { roleType, belongOrgId } = G.ISCED_curRoleInfo;
    // let curSignArray=JSON.parse(sessionStorage.getItem('tabArray'))||[]
    let curSignArray = G.ISCED_tabArray || []
    this.setState({
      pinkInfo,
    });
    if (roleType==="1" || roleType === '2') {
      //当前为校级
      //调获取统计率的接口函数

      //调获取统计列表接口
      // this.props.zoe_getClaColSta({ ...pinkInfo, ...sort, collegeId });
      if (curSignArray.length <= 1) { //查看所有学院数据
        this.props.zoe_getClaSchRate({ ...pinkInfo });
        //开课单位统计列表
        this.props.zoe_getClaColSta({ ...pinkInfo, ...sort, collegeId });
      } else if (curSignArray.length === 2) {
        //课程统计 查看学院下所有课程数据  调获取统计率、统计列表
        this.props.zoe_getClaColRate({
          ...pinkInfo,
          collegeId
        });
        this.props.zoe_getClaCourSta({
          ...pinkInfo,
          collegeId,
          ...sort,
          pageNum,
          pageSize,
          courseId
        });
      } else if (curSignArray.length === 3) {
        //教学班统计 查看课程所有教学班数据 调获取统计率、列表接口
        this.props.zoe_getClaCourRate({
          ...pinkInfo,
          courseId,
          collegeId
        });
        //教学班统计
        this.props.zoe_getClaAdmSta({
          ...pinkInfo,
          collegeId,
          courseId,
          ...sort,
          pageNum,
          pageSize
        });
      } else if (curSignArray.length === 4) {
        //课堂数据 教学班所有课堂数据 调获取统计率、列表接口
        this.props.zoe_getClaRoomRate({
          ...pinkInfo,
          collegeId,
          teaClaId
        });
        //课堂统计
        this.props.zoe_getClaRoomSta({
          ...pinkInfo,
          teaClaId,
          collegeId,
          ...sort,
          pageNum,
          pageSize
        });
      }
    } else {
      if (curSign == 2) { //院级账号 或者 校级账号下钻到学院级
        //开课单位统计     课程统计 学院下所有课程数据  调获取统计率-统计列表接口
        // this.props.zoe_getClaColSta({ ...pinkInfo, ...sort, collegeId:belongOrgId });
        this.props.zoe_getClaColRate({
          ...pinkInfo,
          collegeId: belongOrgId
        });
        // //课程统计
        this.props.zoe_getClaCourSta({
          ...pinkInfo,
          collegeId: belongOrgId,
          ...sort,
          pageNum,
          pageSize,
          courseId
        });
      } else if (curSign == 3) {
        //教学班统计
        this.props.zoe_getClaCourRate({
          ...pinkInfo,
          courseId,
          collegeId: belongOrgId
        });
        this.props.zoe_getClaAdmSta({
          ...pinkInfo,
          collegeId: belongOrgId,
          courseId,
          ...sort,
          pageNum,
          pageSize
        });
      } else if (curSign == 4) {
        //课堂统计
        this.props.zoe_getClaRoomRate({
          ...pinkInfo,
          collegeId: belongOrgId,
          teaClaId
        });
        this.props.zoe_getClaRoomSta({
          ...pinkInfo,
          teaClaId,
          collegeId: belongOrgId,
          ...sort,
          pageNum,
          pageSize
        });
      }

      this.setState({
        collegeId: belongOrgId
      })
      //调获取开课单位的统计率
      //调获取课程的统计列表
      // this.props.zoe_getClaColRate({
      //   ...pinkInfo,
      //   collegeId: belongOrgId
      // });
      // this.props.zoe_getClaCourSta({
      //   ...pinkInfo,
      //   collegeId: belongOrgId,
      //   ...sort,
      //   pageNum,
      //   pageSize,
      //   courseId,
      //   teaClaId
      // });
    }
  };
  //获取表格排序参数
  getSortParams = sort => {
    const {
      pinkInfo,
      curSign,
      collegeId,
      courseId,
      teaClaId,
      pageSize,
      pageNum
    } = this.state;
    this.setState({
      sort
    });
    if (curSign === 1) { //校级
      //开课单位统计     所有学院统计数据
      this.props.zoe_getClaColSta({ ...pinkInfo, ...sort, collegeId });
    } else if (curSign === 2) { //学院下所有课程数据
      //课程统计
      this.props.zoe_getClaCourSta({
        ...pinkInfo,
        collegeId,
        ...sort,
        pageNum,
        pageSize,
        courseId
      });
    } else if (curSign === 3) { //课程下所有教学班数据
      //教学班统计
      this.props.zoe_getClaAdmSta({
        ...pinkInfo,
        collegeId,
        courseId,
        ...sort,
        pageNum,
        pageSize
      });
    } else if (curSign === 4) { //教学班 所有课堂数据
      //课堂统计
      this.props.zoe_getClaRoomSta({
        ...pinkInfo,
        teaClaId,
        collegeId,
        ...sort,
        pageNum,
        pageSize
      });
    }
  };
  //获取开课单位id（学院id） 从搜索下拉开课单位列表里获取
  getCollegeId = collegeId => {
    const { pinkInfo, sort } = this.state;
    this.node.scrollIntoView();
    this.setState({
      collegeId
    });
    //选择了开课单位之后需要重新调列表统计接口
    this.props.zoe_getClaColSta({ ...pinkInfo, ...sort, collegeId });

  };
  // 获取课程id 从搜索下拉课程列表里获取
  getCourseId = courseId => {
    const { pinkInfo, sort, collegeId, pageNum, pageSize } = this.state;
    // console.log('courseId', courseId)
    this.node.scrollIntoView();
    this.setState({
      courseId
    });
    this.props.zoe_getClaCourSta({
      ...pinkInfo,
      collegeId,
      ...sort,
      pageNum,
      pageSize,
      courseId
    });

  };
  // 下载函数
  downLoad = () => {
    const {
      pinkInfo,
      sort,
      curSign,
      colRecord,
      courRecord,
      claRecord,
      collegeId,
      courseId,
      teaClaId
    } = this.state;
    if (curSign === 1) {
      this.props.zoe_downClaColSta({ ...pinkInfo, ...sort, collegeId });
    } else if (curSign === 2) {
      this.props.zoe_downClaCourSta({
        ...pinkInfo,
        ...sort,
        collegeId,
        courseId
      });
    } else if (curSign === 3) {
      this.props.zoe_downClaAdmSta({
        ...pinkInfo,
        ...sort,
        courseId,
        collegeId
      });
    } else if (curSign === 4) {
      this.props.zoe_downClaRoomSta({
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
  //排序函数
  setSort = (checkType, sortType) => {
    const { sortArr } = this.state;
    sortArr.map(item => {
      if (item.checkType === checkType) {
        if (item.sortType === sortType) {
          item.sortType = 0;
          checkType = "";
          sortType = 0;
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
  // 获取分页参数
  getPageNum = pageNum => {
    this.setState({
      pageNum
    });
    this.node.scrollIntoView();
    const {
      pinkInfo,
      curSign,
      sort,
      collegeId,
      courseId,
      teaClaId,
      pageSize
    } = this.state;
    if (curSign === 1) {
      //开课单位统计
      this.setState({
        pageNum: 1
      });
    } else if (curSign === 2) {
      //课程统计
      this.props.zoe_getClaCourSta({
        ...pinkInfo,
        collegeId,
        ...sort,
        pageNum,
        pageSize,
        courseId
      });
    } else if (curSign === 3) {
      //教学班统计
      this.props.zoe_getClaAdmSta({
        ...pinkInfo,
        courseId,
        collegeId,
        ...sort,
        pageNum,
        pageSize
      });
    } else if (curSign === 4) {
      //课堂统计
      this.props.zoe_getClaRoomSta({
        ...pinkInfo,
        teaClaId,
        collegeId,
        ...sort,
        pageNum,
        pageSize
      });
    }
  };
  // 获取课程统计Dom
  getOrderClaDom = () => {
    const {
      curSign,
      pinkInfo,
      collegeId,
      courseId,
      pageSize,
      pageNum,
      sortArr
    } = this.state;

    // let curSignArray=JSON.parse(sessionStorage.getItem('tabArray'))||[]
    let curSignArray = G.ISCED_tabArray || []
    const { roleType } = G.ISCED_curRoleInfo;
    if (roleType==="1" || roleType === '2') { //校级
      switch (curSignArray.length) {
        case 0:
        case 1: //校级-所有学院数据
          return (
            <ZoeOrderClaCollege
              collegeId={collegeId}
              courseId={courseId}
              pinkInfo={pinkInfo}
              sortArr={sortArr}
              pageNum={pageNum}
              curSign={curSign}
              pageSize={pageSize}
              getCourseId={this.getCourseId}
              getCollegeId={this.getCollegeId}
              getCurSign={this.getCurSign}
              downLoad={this.downLoad}
              getPageNum={this.getPageNum}
              setSort={this.setSort}
            />
          );
        case 2: //校级-学段下所有课程数据 or 院级-所有课程数据
          return (
            <ZoeOrderClaCourse
              collegeId={collegeId}
              courseId={courseId}
              pinkInfo={pinkInfo}
              sortArr={sortArr}
              curSign={curSign}
              pageNum={pageNum}
              pageSize={pageSize}
              getCourseId={this.getCourseId}
              getCollegeId={this.getCollegeId}
              getCurSign={this.getCurSign}
              downLoad={this.downLoad}
              getPageNum={this.getPageNum}
              setSort={this.setSort}
            />
          );
        case 3: //校级-课程下所有教学班数据 or 院级-课程下所有教学班数据
          return (
            <ZoeOrderClaAdm
              collegeId={collegeId}
              courseId={courseId}
              pinkInfo={pinkInfo}
              sortArr={sortArr}
              curSign={curSign}
              pageNum={pageNum}
              pageSize={pageSize}
              downLoad={this.downLoad}
              getCurSign={this.getCurSign}
              getPageNum={this.getPageNum}
              setSort={this.setSort}
            />
          );
        case 4: //校级-教学班下所有课堂数据 or 院级-教学班下所哟课堂数据
          return (
            <ZoeOrderClaRoom
              collegeId={collegeId}
              courseId={courseId}
              pinkInfo={pinkInfo}
              sortArr={sortArr}
              curSign={curSign}
              pageNum={pageNum}
              pageSize={pageSize}
              downLoad={this.downLoad}
              getCurSign={this.getCurSign}
              getPageNum={this.getPageNum}
              setSort={this.setSort}
              history={this.props.history}
            />
          );
      }
    } else { //院级
      switch (curSignArray.length) {
        case 0:
        case 1:
          return (
            <ZoeOrderClaCourse
              collegeId={collegeId}
              courseId={courseId}
              pinkInfo={pinkInfo}
              sortArr={sortArr}
              curSign={curSign}
              pageNum={pageNum}
              pageSize={pageSize}
              getCourseId={this.getCourseId}
              getCollegeId={this.getCollegeId}
              getCurSign={this.getCurSign}
              downLoad={this.downLoad}
              getPageNum={this.getPageNum}
              setSort={this.setSort}
            />
          );
        case 2:
          return (
            <ZoeOrderClaAdm
              collegeId={collegeId}
              courseId={courseId}
              pinkInfo={pinkInfo}
              sortArr={sortArr}
              curSign={curSign}
              pageNum={pageNum}
              pageSize={pageSize}
              downLoad={this.downLoad}
              getCurSign={this.getCurSign}
              getPageNum={this.getPageNum}
              setSort={this.setSort}
            />
          );
        case 3:
          return (
            <ZoeOrderClaRoom
              collegeId={collegeId}
              courseId={courseId}
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
    const {
      curSign,
      orgName,
      colRecord,
      courRecord,
      claRecord,
      collegeId
    } = this.state;
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
          pageType={1}
          curSign={curSign}
          getCurSign={this.getCurSign}
          changeSign={this.changeSign}
          record={{ colRecord, courRecord, claRecord }}
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
            {this.getOrderClaDom()}
          </div>
        </div>
      </div>
    );
  }
}

export default OrderCourseData;

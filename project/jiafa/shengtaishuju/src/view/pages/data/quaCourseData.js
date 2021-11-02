/*
 * @Author: lxx
 * @Date: 2020-01-23 09:34:21
 * @Last Modified by: tj
 * @Last Modified time: 2020-08-06 16:05:39
 * 教学质量-课程统计
 */
import React, { Component } from "react";
import ZoeQuaNav from "../../components/data/zoe-components/zoe-quaNav";
import ZoeOrderNav from "../../components/data/zoe-components/zoe-orderNav";
import ZoeHeader from "../../components/data/zoe-components/zoe-header";
import ZoeQuaClaCollege from "../../components/data/zoe-components/zoe-quaClaCollege";
import ZoeQuaClaCourse from "../../components/data/zoe-components/zoe-quaClaCourse";
import ZoeQuaClaAdm from "../../components/data/zoe-components/zoe-quaClaAdm";
import ZoeQuaClaRoom from "../../components/data/zoe-components/zoe-quaClaRoom";
import G from "../../../config/g";
import {
  zoe_getClaSchHea,
  zoe_Qua_getClaColSta,
  zoe_getClaColHea,
  zoe_Qua_getClaCourSta,
  zoe_getClaAdmHea,
  zoe_Qua_getClaAdmSta,
  zoe_getClaRoomHea,
  zoe_Qua_getClaRoomSta,
  //下载
  zoe_Qua_downClaColSta,
  zoe_Qua_downClaCourSta,
  zoe_Qua_downClaAdmSta,
  zoe_Qua_downClaRoomSta
} from "../../../redux/zoe-dataQua.reducer";
import { ws_saveGlobalData } from '../../../redux/ws-global.reducer';
import { connect } from "react-redux";
@connect(state => ({ ...state.zoe_quaData, ...state.ws_global_reducer }), {
  zoe_getClaSchHea,
  zoe_Qua_getClaColSta,
  zoe_getClaColHea,
  zoe_Qua_getClaCourSta,
  zoe_getClaAdmHea,
  zoe_Qua_getClaAdmSta,
  zoe_getClaRoomHea,
  zoe_Qua_getClaRoomSta,
  //下载
  zoe_Qua_downClaColSta,
  zoe_Qua_downClaCourSta,
  zoe_Qua_downClaAdmSta,
  zoe_Qua_downClaRoomSta,
  ws_saveGlobalData
})
class QuaCourseData extends Component {
  constructor(props) {
    super(props);
    let tabArray = G.ISCED_tabArray || []
    let roleType = G.ISCED_curRoleInfo.roleType
    this.state = {
      curSign: tabArray.length
        ? (roleType==="1" || roleType === '2')
          ? tabArray.length
          : tabArray.length + 1
        : (roleType==="1" || roleType === '2') ? 1 : 2, //校级账号展示开课单位统计 院级账号展示课程统计 展示 1开课单位  2课程 3教学班 4课堂
      orgName: tabArray.length && tabArray[tabArray.length - 1].orgName || G.ISCED_curRoleInfo.belongOrgName, //机构名称
      colRecord: {}, //点击的开课单位数据
      courRecord: {}, //点击的课程数据
      claRecord: {}, //点击的教学班数据
      pinkInfo: {}, //头部筛选参数
      pageNum: 1, //当前页
      pageSize: 20, //每页20条
      collegeId: tabArray.length && tabArray[tabArray.length - 1].collegeId || '', //开课单位id
      courseId: tabArray.length && tabArray[tabArray.length - 1].courseId || '', //课程id
      teaClaId: tabArray.length && tabArray[tabArray.length - 1].teaClaId || '',
    };
  }
  componentDidMount() { }

  componentWillReceiveProps(props) {
    console.log(props)
    const { roleType } = G.ISCED_curRoleInfo;
    let { curSign } = this.state;
    console.log(props.ISCED_tabArray.length)
    if (curSign !== 1 && !(props.ISCED_tabArray && props.ISCED_tabArray.length) && this.state.orgName !== G.ISCED_curRoleInfo.belongOrgName) {
      console.log(props.ISCED_tabArray.length)
      this.setState({
        curSign: (roleType==="1" || roleType === '2') ? 1 : 2,
        orgName: G.ISCED_curRoleInfo.belongOrgName
      })
    }
  }
  //修改当前展示标识
  getCurSign = (curSign, record) => {
    const { pinkInfo, pageNum, pageSize, courseId, collegeId } = this.state;
    const { roleType, belongOrgId, belongOrgName } = G.ISCED_curRoleInfo;
    this.node.scrollIntoView();
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
              ? record.courseName
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
    let obj;
    if (curSign === 1) {
      this.setState({
        collegeId: ""
      });
      //调获取统计率的接口函数
      this.props.zoe_getClaSchHea({ ...pinkInfo });
      //调获取统计列表接口
      this.props.zoe_Qua_getClaColSta({ ...pinkInfo, collegeId: "" });
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
          courseId: "",
          pageNum: 1
        });
        //表示当前点击的开课单位
        //调获取开课单位的统计率
        //调获取课程的统计列表
        this.props.zoe_getClaColHea({
          ...pinkInfo,
          collegeId: record.collegeId
        });
        this.props.zoe_Qua_getClaCourSta({
          ...pinkInfo,
          collegeId: record.collegeId,
          pageNum: 1,
          pageSize,
          courseId: ""
        });
        obj = {
          ...pinkInfo,
          collegeId: record.collegeId,
          pageNum: 1,
          pageSize,
          curSign,
          courseId: "",
          orgName: ((roleType==="1" || roleType === '2') 
            ? record.collegeName 
            : (roleType==="3" || roleType === '4') 
            ? belongOrgName 
            : '')
        }
      } else {
        this.setState({
          collegeId: belongOrgId,
          courseId: "",
          pageNum: 1
        });
        //表示当前点击的开课单位
        //调获取开课单位的统计率
        //调获取课程的统计列表
        this.props.zoe_getClaColHea({
          ...pinkInfo,
          collegeId: belongOrgId
        });
        this.props.zoe_Qua_getClaCourSta({
          ...pinkInfo,
          collegeId: belongOrgId,
          pageNum: 1,
          pageSize,
          courseId: ""
        });
        obj = {
          ...pinkInfo,
          collegeId: belongOrgId,
          curSign,
          pageNum: 1,
          pageSize,
          courseId: "",
          orgName: ((roleType==="1" || roleType === '2')
            ? record.collegeName 
            : (roleType==="3" || roleType === '4')
            ? belongOrgName : '')
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
      this.props.zoe_getClaAdmHea({
        ...pinkInfo,
        courseId: record.courseId,
        collegeId: array[array.length - 1].collegeId,
      });
      this.props.zoe_Qua_getClaAdmSta({
        ...pinkInfo,
        courseId: record.courseId,
        collegeId: array[array.length - 1].collegeId,
        pageNum: 1,
        pageSize
      });
      obj = {
        ...pinkInfo,
        courseId: record.courseId,
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
      this.props.zoe_getClaRoomHea({
        ...pinkInfo,
        collegeId: array[array.length - 1].collegeId,
        teaClaId: record.teaClaId
      });
      this.props.zoe_Qua_getClaRoomSta({
        ...pinkInfo,
        teaClaId: record.teaClaId,
        collegeId: array[array.length - 1].collegeId,
        pageNum: 1,
        pageSize
      });
      obj = {
        ...pinkInfo,
        teaClaId: record.teaClaId,
        collegeId: array[array.length - 1].collegeId,
        curSign,
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
    const { curSign, collegeId, pageNum, pageSize, courseId, teaClaId } = this.state;
    const { roleType, belongOrgId } = G.ISCED_curRoleInfo;
    let curSignArray = G.ISCED_tabArray || []
    this.setState({
      pinkInfo
    });

    if (roleType==="1" || roleType === '2') {
      if (curSign === 1) {
        //调获取统计率的接口函数
        this.props.zoe_getClaSchHea({ ...pinkInfo });
        //调获取统计列表接口
        this.props.zoe_Qua_getClaColSta({ ...pinkInfo, collegeId: "" });
      }
      if (curSign === 2) {
        //表示当前点击的开课单位
        //调获取开课单位的统计率
        //调获取课程的统计列表
        this.props.zoe_getClaColHea({
          ...pinkInfo,
          collegeId
        });
        this.props.zoe_Qua_getClaCourSta({
          ...pinkInfo,
          collegeId,
          pageNum: 1,
          pageSize,
          courseId: ""
        });
      }
      if (curSign === 3) {
        //表示当前点击的课程
        //调获取课程的统计率
        //调获取教学班的统计列表
        this.props.zoe_getClaAdmHea({
          ...pinkInfo,
          courseId,
          collegeId,
        });
        this.props.zoe_Qua_getClaAdmSta({
          ...pinkInfo,
          courseId,
          collegeId,
          pageNum: 1,
          pageSize
        });
      }
      if (curSign === 4) {
        //表示当前点击的课堂
        //调获取教学班的统计率
        //调获取课堂的统计列表
        this.props.zoe_getClaRoomHea({
          ...pinkInfo,
          collegeId,
          teaClaId
        });
        this.props.zoe_Qua_getClaRoomSta({
          ...pinkInfo,
          teaClaId,
          collegeId,
          pageNum: 1,
          pageSize
        });
      }
    } else {
      if (curSign == 2) {
        this.props.zoe_getClaColHea({
          ...pinkInfo,
          collegeId: belongOrgId,
        });
        this.props.zoe_Qua_getClaCourSta({
          ...pinkInfo,
          collegeId: belongOrgId,
          pageNum: 1,
          pageSize,
          courseId: ""
        });
      } else if (curSign == 3) {
        //调获取课程的统计率
        //调获取教学班的统计列表
        this.props.zoe_getClaAdmHea({
          ...pinkInfo,
          collegeId: belongOrgId,
          collegeId,
        });
        this.props.zoe_Qua_getClaAdmSta({
          ...pinkInfo,
          courseId,
          collegeId: belongOrgId,
          pageNum: 1,
          pageSize
        });
      } else if (curSign == 4) {
        //调获取教学班的统计率
        //调获取课堂的统计列表
        this.props.zoe_getClaRoomHea({
          ...pinkInfo,
          collegeId: belongOrgId,
          teaClaId
        });
        this.props.zoe_Qua_getClaRoomSta({
          ...pinkInfo,
          teaClaId,
          collegeId: belongOrgId,
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
      courRecord,
      claRecord,
      collegeId,
      pinkInfo,
      pageSize,
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
    if (roleType==="1" || roleType === '2') {
      //在点击面包削返回的时候 需要把课程统计选择的课程id给清掉
      if (array1.length === 1) {
        this.setState({
          collegeId: "",
          courseId: "",
          orgName: array1[0].orgName
        });
        //调获取统计率的接口函数
        this.props.zoe_getClaSchHea({ ...pinkInfo });
        this.props.zoe_Qua_getClaColSta({ ...pinkInfo, collegeId: "" });
      } else if (array1.length === 2) {
        //只有当前在3 或4 的时候才有可能返回到2
        this.setState({
          pageNum: 1,
          courseId: "",
          orgName: array1[1].orgName
        });
        this.props.zoe_getClaColHea({
          ...pinkInfo,
          collegeId: array1[1].collegeId,
        });
        this.props.zoe_Qua_getClaCourSta({
          ...pinkInfo,
          collegeId: array1[1].collegeId,
          pageNum: 1,
          pageSize,
          courseId: ""
        });
      } else if (array1.length === 3) {
        this.setState({
          pageNum: 1,
          orgName: array1[2].orgName
        });
        //表示当前点击的课程
        //调获取课程的统计率
        //调获取教学班的统计列表
        this.props.zoe_getClaAdmHea({
          ...pinkInfo,
          courseId: array1[2].courseId,
          collegeId: array1[2].collegeId,
        });
        this.props.zoe_Qua_getClaAdmSta({
          ...pinkInfo,
          courseId: array1[2].courseId,
          collegeId: array1[2].collegeId,
          pageNum: 1,
          pageSize
        });
      }
    } else {
      //在点击面包削返回的时候 需要把课程统计选择的课程id给清掉
      if (array1.length === 1) {
        //只有当前在3 或4 的时候才有可能返回到2
        this.setState({
          pageNum: 1,
          courseId: ""
        });
        this.props.zoe_getClaColHea({
          ...pinkInfo,
          collegeId: array1[0].collegeId
        });
        this.props.zoe_Qua_getClaCourSta({
          ...pinkInfo,
          collegeId: array1[0].collegeId,
          pageNum: 1,
          pageSize,
          courseId: ''
        });
      } else if (array1.length === 2) {
        this.setState({
          pageNum: 1
        });
        //表示当前点击的课程
        //调获取课程的统计率
        //调获取教学班的统计列表
        this.props.zoe_getClaAdmHea({
          ...pinkInfo,
          courseId: array1[1].courseId,
          collegeId: array1[1].collegeId
        });
        this.props.zoe_Qua_getClaAdmSta({
          ...pinkInfo,
          courseId: array1[1].courseId,
          collegeId: array1[1].collegeId,
          pageNum: 1,
          pageSize
        });
      }
    }

  };
  // 下载函数
  downLoad = () => {
    const {
      pinkInfo,
      curSign,
      colRecord,
      courRecord,
      claRecord,
      courseId,
      collegeId,
      teaClaId
    } = this.state;
    if (curSign === 1) {
      this.props.zoe_Qua_downClaColSta({ ...pinkInfo, collegeId });
    } else if (curSign === 2) {
      this.props.zoe_Qua_downClaCourSta({
        ...pinkInfo,
        collegeId,
        courseId
      });
    } else if (curSign === 3) {
      this.props.zoe_Qua_downClaAdmSta({
        ...pinkInfo,
        courseId,
        collegeId
      });
    } else if (curSign === 4) {
      this.props.zoe_Qua_downClaRoomSta({
        ...pinkInfo,
        teaClaId,
        collegeId
      });
    }
  };
  //获取开课单位id 从搜索下拉开课单位列表里获取
  getCollegeId = collegeId => {
    const { pinkInfo } = this.state;
    this.node.scrollIntoView();
    this.setState({
      collegeId
    });
    //选择了开课单位之后需要重新调列表统计接口
    this.props.zoe_Qua_getClaColSta({ ...pinkInfo, collegeId });
  };
  // 获取课程id 从搜索下拉课程列表里获取
  getCourseId = courseId => {
    const { pinkInfo, collegeId, pageNum, pageSize } = this.state;
    this.node.scrollIntoView();
    this.setState({
      courseId
    });
    this.props.zoe_Qua_getClaCourSta({
      ...pinkInfo,
      collegeId,
      pageNum,
      pageSize,
      courseId
    });
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
      this.props.zoe_Qua_getClaCourSta({
        ...pinkInfo,
        collegeId,
        pageNum,
        pageSize,
        courseId
      });
    } else if (curSign === 3) {
      //教学班统计
      this.props.zoe_Qua_getClaAdmSta({
        ...pinkInfo,
        collegeId,
        courseId,
        pageNum,
        pageSize
      });
    } else if (curSign === 4) {
      //课堂统计
      this.props.zoe_Qua_getClaRoomSta({
        ...pinkInfo,
        teaClaId,
        collegeId,
        pageNum,
        pageSize
      });
    }
  };
  // 获取课程统计Dom
  getQuaClaDom = () => {
    const {
      curSign,
      pinkInfo,
      collegeId,
      courseId,
      pageSize,
      pageNum
    } = this.state;
    let curSignArray = G.ISCED_tabArray || []
    const { roleType } = G.ISCED_curRoleInfo;
    if (roleType==="1" || roleType === '2') {
      switch (curSignArray.length) {
        case 0:
        case 1:
          return (
            <ZoeQuaClaCollege
              collegeId={collegeId}
              courseId={courseId}
              pinkInfo={pinkInfo}
              pageNum={pageNum}
              curSign={curSign}
              pageSize={pageSize}
              getCourseId={this.getCourseId}
              getCollegeId={this.getCollegeId}
              getCurSign={this.getCurSign}
              downLoad={this.downLoad}
              getPageNum={this.getPageNum}
            />
          );
        case 2:
          return (
            <ZoeQuaClaCourse
              collegeId={collegeId}
              courseId={courseId}
              pinkInfo={pinkInfo}
              pageNum={pageNum}
              pageSize={pageSize}
              curSign={curSign}
              getCourseId={this.getCourseId}
              getCollegeId={this.getCollegeId}
              getCurSign={this.getCurSign}
              downLoad={this.downLoad}
              getPageNum={this.getPageNum}
            />
          );
        case 3:
          return (
            <ZoeQuaClaAdm
              collegeId={collegeId}
              courseId={courseId}
              pinkInfo={pinkInfo}
              pageNum={pageNum}
              curSign={curSign}
              pageSize={pageSize}
              downLoad={this.downLoad}
              getCurSign={this.getCurSign}
              getPageNum={this.getPageNum}
            />
          );
        case 4:
          return (
            <ZoeQuaClaRoom
              collegeId={collegeId}
              courseId={courseId}
              pinkInfo={pinkInfo}
              pageNum={pageNum}
              curSign={curSign}
              pageSize={pageSize}
              downLoad={this.downLoad}
              getCurSign={this.getCurSign}
              getPageNum={this.getPageNum}
              history={this.props.history}
            />
          );
      }
    } else {
      switch (curSignArray.length) {
        case 0:
        case 1:
          return (
            <ZoeQuaClaCourse
              collegeId={collegeId}
              courseId={courseId}
              pinkInfo={pinkInfo}
              pageNum={pageNum}
              pageSize={pageSize}
              curSign={curSign}
              getCourseId={this.getCourseId}
              getCollegeId={this.getCollegeId}
              getCurSign={this.getCurSign}
              downLoad={this.downLoad}
              getPageNum={this.getPageNum}
            />
          );
        case 2:
          return (
            <ZoeQuaClaAdm
              collegeId={collegeId}
              courseId={courseId}
              pinkInfo={pinkInfo}
              pageNum={pageNum}
              curSign={curSign}
              pageSize={pageSize}
              downLoad={this.downLoad}
              getCurSign={this.getCurSign}
              getPageNum={this.getPageNum}
            />
          );
        case 3:
          return (
            <ZoeQuaClaRoom
              collegeId={collegeId}
              courseId={courseId}
              pinkInfo={pinkInfo}
              pageNum={pageNum}
              curSign={curSign}
              pageSize={pageSize}
              downLoad={this.downLoad}
              getCurSign={this.getCurSign}
              getPageNum={this.getPageNum}
              history={this.props.history}
            />
          );
      }
    }

  };
  render() {
    const { curSign, orgName, colRecord, courRecord, claRecord } = this.state;
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
        {/* <ZoeQuaNav
          pageType={1}
          curSign={curSign}
          getCurSign={this.getCurSign}
          changeSign={this.changeSign}
          record={{ colRecord, courRecord, claRecord }}
        /> */}
        <ZoeOrderNav
          pageType={1}
          curSign={curSign}
          getCurSign={this.getCurSign}
          changeSign={this.changeSign}
          record={{ colRecord, courRecord, claRecord }}
        />
        <div className="zoe-data-container1">
          <ZoeHeader curSign={curSign} getHeaderParams={this.getHeaderParams} />
          <div
            style={{
              width: "100%",
              height: "calc(100% - 75px)",
              padding: "20px 20px 0 20px"
            }}
          >
            <div style={{ height: 45, fontSize: 20 }}>{orgName}</div>
            {this.getQuaClaDom()}
          </div>
        </div>
        <div className="zoe-footer">
          <span>【备注】</span>
          <span style={{ marginRight: 20 }}>
            学生起立(次/课时)：学生平均每课时的起立次数
          </span>
          <span>教师上下讲台(次/课时)：教师平均每课时走上/走下讲台的次数</span>
        </div>
      </div>
    );
  }
}

export default QuaCourseData;

/*
 * @Author: lxx
 * @Date: 2020-01-23 09:35:14
 * @Last Modified by: tj
 * @Last Modified time: 2020-08-06 16:06:54
 * 教学质量-教师统计
 */
import React, { Component } from "react";
import ZoeQuaNav from "../../components/data/zoe-components/zoe-quaNav";
import ZoeHeader from "../../components/data/zoe-components/zoe-header";
import ZoeOrderNav from "../../components/data/zoe-components/zoe-orderNav";
import ZoeQuaMasCollege from "../../components/data/zoe-components/zoe-quaMasCollege";
import ZoeQuaMasTeacher from "../../components/data/zoe-components/zoe-quaMasTeacher";
import ZoeQuaMasAdm from "../../components/data/zoe-components/zoe-quaMasAdm";
import ZoeQuaMasRoom from "../../components/data/zoe-components/zoe-quaMasRoom";
import { ws_saveGlobalData } from '../../../redux/ws-global.reducer';
import { connect } from "react-redux";
import {
  zoe_getMasSchHea,
  zoe_Qua_getMasColSta,
  zoe_getMasColHea,
  zoe_Qua_getMasTeaSta,
  zoe_getMasTeaHea,
  zoe_Qua_getMasAdmSta,
  zoe_getMasAdmHea,
  zoe_Qua_getMasRoomSta,
  //下载接口
  zoe_Qua_downMasColSta,
  zoe_Qua_downMasTeaSta,
  zoe_Qua_downMasAdmSta,
  zoe_Qua_downMasRoomSta
} from "../../../redux/zoe-dataQua.reducer";
@connect(state => ({ ...state.zoe_quaData, ...state.ws_global_reducer }), {
  zoe_getMasSchHea,
  zoe_Qua_getMasColSta,
  zoe_getMasColHea,
  zoe_Qua_getMasTeaSta,
  zoe_getMasTeaHea,
  zoe_Qua_getMasAdmSta,
  zoe_getMasAdmHea,
  zoe_Qua_getMasRoomSta,
  //下载接口
  zoe_Qua_downMasColSta,
  zoe_Qua_downMasTeaSta,
  zoe_Qua_downMasAdmSta,
  zoe_Qua_downMasRoomSta,
  ws_saveGlobalData
})
class QuaTeaData extends Component {
  constructor(props) {
    super(props);
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
      teaRecord: {}, //点击的教师数据
      claRecord: {}, //点击的教学班数据
      pinkInfo: {}, //头部筛选参数
      collegeId: tabArray.length && tabArray[tabArray.length - 1].collegeId || '', //开课单位id
      teacherId: tabArray.length && tabArray[tabArray.length - 1].teacherId || '', //课程id
      teaClaId: tabArray.length && tabArray[tabArray.length - 1].teaClaId || '',
      pageNum: 1, //当前页
      pageSize: 20, //每页20条
    };
  }
  componentDidMount() { }

  // 监听页面变化
  componentWillReceiveProps(props) {
    console.log(props)
    const { roleType } = G.ISCED_curRoleInfo;
    let { curSign } = this.state;
    // console.log(props.ISCED_tabArray.length)
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
    const { pinkInfo, pageNum, pageSize, teacherId, collegeId } = this.state;
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
      this.props.zoe_getMasSchHea({ ...pinkInfo });
      // //调获取统计列表接口
      this.props.zoe_Qua_getMasColSta({ ...pinkInfo, collegeId: "" });
      obj = {
        ...pinkInfo,
        collegeId: '',
        curSign,
        orgName: belongOrgName

      }
    }
    if (curSign === 2) {
      if (roleType==="1" || roleType === '2') {
        //校级
        this.setState({
          colRecord: record, //点击的开课单位数据
          collegeId: record.collegeId,
          teacherId: "",
          pageNum: 1
        });
        //表示当前点击的开课单位
        //调获取开课单位的统计率
        //调获取教师的统计列表
        this.props.zoe_getMasColHea({
          ...pinkInfo,
          collegeId: record.collegeId
        });
        this.props.zoe_Qua_getMasTeaSta({
          ...pinkInfo,
          collegeId: record.collegeId,
          pageNum: 1,
          pageSize,
          teacherId: ""
        });
        obj = {
          ...pinkInfo,
          collegeId: record.collegeId,
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
        this.props.zoe_getMasColHea({
          ...pinkInfo,
          collegeId: belongOrgId
        });
        this.props.zoe_Qua_getMasTeaSta({
          ...pinkInfo,
          collegeId: belongOrgId,
          pageNum: 1,
          pageSize,
          teacherId: ""
        });
        obj = {
          ...pinkInfo,
          collegeId: belongOrgId,
          curSign,
          pageNum: 1,
          pageSize,
          teacherId: "",
          orgName: belongOrgName
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
      this.props.zoe_getMasTeaHea({
        ...pinkInfo,
        teacherId: record.teacherId,
        collegeId: array[array.length - 1].collegeId
      });
      this.props.zoe_Qua_getMasAdmSta({
        ...pinkInfo,
        teacherId: record.teacherId,
        collegeId: array[array.length - 1].collegeId,
        pageNum: 1,
        pageSize
      });
      obj = {
        ...pinkInfo,
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
      this.props.zoe_getMasAdmHea({
        ...pinkInfo,
        collegeId: array[array.length - 1].collegeId,
        teaClaId: record.teaClaId
      });
      this.props.zoe_Qua_getMasRoomSta({
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
    const { curSign, collegeId, teacherId, pageNum, pageSize, teaClaId } = this.state;
    let curSignArray = G.ISCED_tabArray || []
    this.setState({
      pinkInfo
    });
    const { roleType, belongOrgId } = G.ISCED_curRoleInfo;
    if (roleType==="1" || roleType === '2') {
      if (curSignArray.length <= 1) {
        //调获取统计率的接口函数
        this.props.zoe_getMasSchHea({ ...pinkInfo });
        // //调获取统计列表接口
        this.props.zoe_Qua_getMasColSta({ ...pinkInfo, collegeId });
      }
      if (curSignArray.length == 2) {
        //调获取开课单位的统计率
        //调获取教师的统计列表
        this.props.zoe_getMasColHea({
          ...pinkInfo,
          collegeId
        });
        this.props.zoe_Qua_getMasTeaSta({
          ...pinkInfo,
          collegeId,
          pageNum: 1,
          pageSize,
          teacherId
        });
      }
      if (curSignArray.length == 3) {
        //调获取教师的统计率
        //调获取教学班的统计列表
        this.props.zoe_getMasTeaHea({
          ...pinkInfo,
          teacherId,
          collegeId
        });
        this.props.zoe_Qua_getMasAdmSta({
          ...pinkInfo,
          teacherId,
          collegeId,
          pageNum: 1,
          pageSize
        });
      }
      if (curSignArray.length == 4) {
        //调获取教学班的统计率
        //调获取课堂的统计列表
        this.props.zoe_getMasAdmHea({
          ...pinkInfo,
          collegeId,
          teaClaId
        });
        this.props.zoe_Qua_getMasRoomSta({
          ...pinkInfo,
          teaClaId,
          collegeId,
          pageNum: 1,
          pageSize
        });
      }
      // //调获取统计率的接口函数
      // this.props.zoe_getMasSchHea({ ...pinkInfo });
      // // //调获取统计列表接口
      // this.props.zoe_Qua_getMasColSta({ ...pinkInfo, collegeId });
    } else {
      if (curSign == 2) {
        //调获取开课单位的统计率
        //调获取教师的统计列表
        this.props.zoe_getMasColHea({
          ...pinkInfo,
          collegeId: belongOrgId
        });
        this.props.zoe_Qua_getMasTeaSta({
          ...pinkInfo,
          collegeId: belongOrgId,
          pageNum: 1,
          pageSize,
          teacherId
        });
      }
      if (curSign == 3) {
        //调获取教师的统计率
        //调获取教学班的统计列表
        this.props.zoe_getMasTeaHea({
          ...pinkInfo,
          teacherId,
          collegeId
        });
        this.props.zoe_Qua_getMasAdmSta({
          ...pinkInfo,
          teacherId,
          collegeId,
          pageNum: 1,
          pageSize
        });
      }
      if (curSign == 4) {
        //调获取教学班的统计率
        //调获取课堂的统计列表
        this.props.zoe_getMasAdmHea({
          ...pinkInfo,
          collegeId,
          teaClaId
        });
        this.props.zoe_Qua_getMasRoomSta({
          ...pinkInfo,
          teaClaId,
          collegeId,
          pageNum: 1,
          pageSize
        });
      }
      this.setState({
        collegeId: belongOrgId
      })
      // //调获取开课单位的统计率
      // //调获取教师的统计列表
      // this.props.zoe_getMasColHea({
      //   ...pinkInfo,
      //   collegeId: belongOrgId
      // });
      // this.props.zoe_Qua_getMasTeaSta({
      //   ...pinkInfo,
      //   collegeId: belongOrgId,
      //   pageNum: 1,
      //   pageSize,
      //   teacherId
      // });
    }
  };
  //只改变当前位置
  changeSign = curSign => {
    const {
      colRecord,
      teaRecord,
      claRecord,
      pinkInfo,
      collegeId,
      pageSize,
      teacherId
    } = this.state;
    this.node.scrollIntoView();
    const { roleType, belongOrgId, belongOrgName } = G.ISCED_curRoleInfo;
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
    // 跳转面包屑需要剪切到对应长度的tabArray
    let array = G.ISCED_tabArray || []
    let array1 = (roleType==="1" || roleType === '2') ? array.slice(0, curSign) : array.slice(0, curSign - 1)
    this.props.ws_saveGlobalData(array1, 'ISCED_tabArray')
    //在点击面包削返回的时候 需要把课程统计选择的课程id给清掉
    if (roleType==="1" || roleType === '2') {
      if (array1.length === 1) {
        this.setState({
          collegeId: "",
          teacherId: "",
          orgName: array1[0].orgName
        });
        this.props.zoe_Qua_getMasColSta({
          ...pinkInfo,
          collegeId: ""
        });
      } else if (array1.length === 2) {
        this.setState({
          pageNum: 1,
          teacherId: "",
          orgName: array1[1].orgName
        });
        //表示当前点击的开课单位
        //调获取开课单位的统计率
        //调获取教师的统计列表
        this.props.zoe_getMasColHea({
          ...pinkInfo,
          collegeId: array1[1].collegeId
        });
        this.props.zoe_Qua_getMasTeaSta({
          ...pinkInfo,
          collegeId: array1[1].collegeId,
          pageNum: 1,
          pageSize,
          teacherId: ""
        });
      } else if (array1.length === 3) {
        //教学班
        this.setState({
          pageNum: 1,
          orgName: array1[2].orgName
        });
        //表示当前到教学班层级
        //调获取教师的统计率
        //调获取教学班的统计列表
        this.props.zoe_getMasTeaHea({
          ...pinkInfo,
          teacherId: array1[2].teacherId,
          collegeId: array1[2].collegeId
        });
        this.props.zoe_Qua_getMasAdmSta({
          ...pinkInfo,
          teacherId: array1[2].teacherId,
          collegeId: array1[2].collegeId,
          pageNum: 1,
          pageSize
        });
      }
    } else {
      if (curSign === 1) {
        this.setState({
          pageNum: 1,
          teacherId: ""
        });
        //表示当前点击的开课单位
        //调获取开课单位的统计率
        //调获取教师的统计列表
        this.props.zoe_getMasColHea({
          ...pinkInfo,
          collegeId
        });
        this.props.zoe_Qua_getMasTeaSta({
          ...pinkInfo,
          collegeId,
          pageNum: 1,
          pageSize,
          teacherId: ""
        });
      } else if (curSign === 2) {
        //教学班
        this.setState({
          pageNum: 1
        });
        //表示当前到教学班层级
        //调获取教师的统计率
        //调获取教学班的统计列表
        this.props.zoe_getMasTeaHea({
          ...pinkInfo,
          teacherId,
          collegeId
        });
        this.props.zoe_Qua_getMasAdmSta({
          ...pinkInfo,
          teacherId,
          collegeId,
          pageNum: 1,
          pageSize
        });
      }
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
    this.props.zoe_Qua_getMasColSta({ ...pinkInfo, collegeId });
  };
  // 获取教师id 从搜索下拉课程列表里获取
  getTeacherId = teacherId => {
    const { pinkInfo, collegeId, pageNum, pageSize } = this.state;
    this.node.scrollIntoView();
    this.setState({
      teacherId
    });
    this.props.zoe_Qua_getMasTeaSta({
      ...pinkInfo,
      collegeId,
      pageNum,
      pageSize,
      teacherId
    });
  };
  // 下载函数
  downLoad = () => {
    const {
      pinkInfo,
      curSign,
      colRecord,
      teaRecord,
      claRecord,
      collegeId,
      teacherId,
      teaClaId
    } = this.state;
    if (curSign === 1) {
      this.props.zoe_Qua_downMasColSta({ ...pinkInfo, collegeId });
    } else if (curSign === 2) {
      this.props.zoe_Qua_downMasTeaSta({
        ...pinkInfo,
        collegeId,
        teacherId
      });
    } else if (curSign === 3) {
      this.props.zoe_Qua_downMasAdmSta({
        ...pinkInfo,
        teacherId,
        collegeId
      });
    } else if (curSign === 4) {
      this.props.zoe_Qua_downMasRoomSta({
        ...pinkInfo,
        teaClaId,
        collegeId
      });
    }
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
      teacherId,
      teaClaId,
      pageSize
    } = this.state;
    if (curSign === 1) {
      //开课单位统计
      this.setState({
        pageNum: 1
      });
    } else if (curSign === 2) {
      //教师统计
      this.props.zoe_Qua_getMasTeaSta({
        ...pinkInfo,
        collegeId,
        pageNum,
        pageSize,
        teacherId
      });
    } else if (curSign === 3) {
      //教学班统计
      this.props.zoe_Qua_getMasAdmSta({
        ...pinkInfo,
        teacherId,
        collegeId,
        pageNum,
        pageSize
      });
    } else if (curSign === 4) {
      //课堂统计
      this.props.zoe_Qua_getMasRoomSta({
        ...pinkInfo,
        teaClaId,
        collegeId,
        pageNum,
        pageSize
      });
    }
  };
  // 获取教师统计dom
  getQuaMasDom = () => {
    const {
      curSign,
      pinkInfo,
      collegeId,
      teacherId,
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
            <ZoeQuaMasCollege
              collegeId={collegeId}
              teacherId={teacherId}
              pinkInfo={pinkInfo}
              pageNum={pageNum}
              curSign={curSign}
              pageSize={pageSize}
              getTeacherId={this.getTeacherId}
              getCollegeId={this.getCollegeId}
              getCurSign={this.getCurSign}
              downLoad={this.downLoad}
              getPageNum={this.getPageNum}
            />
          );
        case 2:
          return (
            <ZoeQuaMasTeacher
              collegeId={collegeId}
              teacherId={teacherId}
              pinkInfo={pinkInfo}
              pageNum={pageNum}
              curSign={curSign}
              pageSize={pageSize}
              getTeacherId={this.getTeacherId}
              getCollegeId={this.getCollegeId}
              getCurSign={this.getCurSign}
              downLoad={this.downLoad}
              getPageNum={this.getPageNum}
            />
          );
        case 3:
          return (
            <ZoeQuaMasAdm
              collegeId={collegeId}
              teacherId={teacherId}
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
            <ZoeQuaMasRoom
              collegeId={collegeId}
              teacherId={teacherId}
              pinkInfo={pinkInfo}
              curSign={curSign}
              pageNum={pageNum}
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
            <ZoeQuaMasTeacher
              collegeId={collegeId}
              teacherId={teacherId}
              pinkInfo={pinkInfo}
              pageNum={pageNum}
              curSign={curSign}
              pageSize={pageSize}
              getTeacherId={this.getTeacherId}
              getCollegeId={this.getCollegeId}
              getCurSign={this.getCurSign}
              downLoad={this.downLoad}
              getPageNum={this.getPageNum}
            />
          );
        case 2:
          return (
            <ZoeQuaMasAdm
              collegeId={collegeId}
              teacherId={teacherId}
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
            <ZoeQuaMasRoom
              collegeId={collegeId}
              teacherId={teacherId}
              pinkInfo={pinkInfo}
              curSign={curSign}
              pageNum={pageNum}
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
    const {
      curSign,
      pinkInfo,
      colRecord,
      teaRecord,
      claRecord,
      orgName,
      collegeId,
      teacherId,
      pageNum,
      pageSize
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
        {/* <ZoeQuaNav
          pageType={2}
          curSign={curSign}
          getCurSign={this.getCurSign}
          changeSign={this.changeSign}
          record={{ colRecord, teaRecord, claRecord }}
        /> */}
        <ZoeOrderNav
          pageType={2}
          curSign={curSign}
          getCurSign={this.getCurSign}
          changeSign={this.changeSign}
          record={{ colRecord, teaRecord, claRecord }}
        />
        <div className="zoe-data-container">
          <ZoeHeader curSign={curSign} getHeaderParams={this.getHeaderParams} />
          <div
            style={{
              width: "100%",
              height: "calc(100% - 75px)",
              padding: "20px 20px 0 20px"
            }}
          >
            <div style={{ height: 45, fontSize: 20 }}>{orgName}</div>
            {this.getQuaMasDom()}
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

export default QuaTeaData;

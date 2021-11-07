/*
 * @Author: MinJ
 * @Date: 2020-07-15 13:51:42
 * @Last Modified by: xm
 * @Last Modified time: 2021-02-04 17:40:01
 * 人员安排
 */
import React, { Component } from 'react';
import { message, Button } from 'antd';
import ModalPonent from './../../../components/modalPonent';
import PagePonent from './../../../components/pagePonent';
import { request, formRequest } from './../../../../util/request';
import PerfectScrollbar from "react-perfect-scrollbar";
import SVG from './../../../public/public-component-svg';
import noneData from './../../../../media/picture/noneData.png';
import PersonPonent from './../../../components/personPonent';
import errorTip from './../../../../media/picture/errorTip.png';
import { G } from './../../../../config/g';
import { v4 as uuidv4 } from 'uuid'
import LimitsModal from './../../../components/limitsModal';
import './../../../../style/zxxk/xksz/mj-ryap.scss';

class Ryap extends Component {
  constructor() {
    super();
    this.state = {
      limitsVisible: false,     //设置范围弹窗
      treeData: [],             //设置范围左侧树结构
      seleList: [],             //设置范围右侧已选择初始化
      personVisible: false,     //添加人员弹窗
      personTree: [],           //添加人员树结构
      personSele: [],           //添加人员已选择初始化
      tableData: [],            //列表数据
      total: 0,                 //列表数据总数
      deleVisible: false,       //删除提示弹框
      perId: '',                //点击删除的人员id
      importVisible: false,     //导入人员弹窗
      fileName: '',             //文件名称
      fileData: undefined,      //文件数据
      pageIndex: 1,
      pageSize: 20,
      leadInError: false,       //导入出错弹窗
      errorUrl: '',             //出错文件下载地址
    }
    this.limitsVi = this.limitsVi.bind(this);
    this.getPlaces = this.getPlaces.bind(this);
    this.modalVi = this.modalVi.bind(this);
    this.personVi = this.personVi.bind(this);
    this.personBtn = this.personBtn.bind(this);
    this.getPersons = this.getPersons.bind(this);
    this.getTableData = this.getTableData.bind(this);
    this.pageChan = this.pageChan.bind(this);
    this.deleTableData = this.deleTableData.bind(this);
    this.deleVi = this.deleVi.bind(this);
    this.downLoadModule = this.downLoadModule.bind(this);
    this.leadInExcel = this.leadInExcel.bind(this);
    this.fileChan = this.fileChan.bind(this);
    this.savePerData = this.savePerData.bind(this);
    this.savePlaceData = this.savePlaceData.bind(this);
    this.downErrorExcel = this.downErrorExcel.bind(this);
  }
  componentDidMount() {
    this.getTableData(1);
  }

  /**
   * @desc 获取列表数据
   * @param {*} pageIndex 页码
   */
  getTableData(pageIndex) {
    const { pageSize } = this.state;
    request('perArrange/getArrangeList', { pageIndex, pageSize }, res => {
      let res1 = {
        result: true,
        data: [],
        total: 50,
      };
      if (res.result) {
        let data = res.data;
        // for (let i = 0; i < 20; i++) {
        //   data.push({
        //     perId: i,
        //     perName: '姓名' + i,
        //     sourExtent: '华西/三教 华西/临医楼 望江/三教 华西/三教 华西/临医楼 望江/三教华西/三教 华西/临医楼 望江/三教 华西/三教 华西/临医楼 望江/三教'
        //   })
        // }
        this.setState({ tableData: data, total: res.total })
      } else {
        message.info(res.message);
        this.setState({ tableData: [], total: 0 })
      }
    })
  }

  /**
   * @desc 下载人员安排模板
   */
  downLoadModule() {
    request('perArrange/getMould', {}, res => {
      if (res.result) {
        let url = res.data.excel_file;
        let downUrl = G.serverUrl + '/' + url;
        console.log('downUrl', downUrl)
        window.open(downUrl)
        // let elink = document.createElement('a');
        // elink.href = downUrl;
        // elink.click();
      } else {
        message.info(res.message);
      }
    })
  }

  /**
   * @desc 导入巡课安排
   */
  leadInExcel() {
    const { fileData, pageIndex } = this.state;
    if (fileData !== undefined) {
      formRequest('perArrange/LeadInExcel', { files: fileData }, res => {
        if (res.result) {
          message.info('导入成功');
          this.getTableData(pageIndex);
          this.setState({
            importVisible: false,
            fileData: undefined,
            fileName: '',
          })
        } else {
          message.info(res.message);
          if (res.data && res.data.excel_file) {
            let errorUrl = res.data.excel_file || '';
            this.setState({
              importVisible: false,
              fileData: undefined,
              fileName: '',
              leadInError: true,
              errorUrl
            })
          }
        }
      })
    } else {
      message.info('请先上传文件')
    }
  }

  /**
   * 下载出错Excel
   */
  downErrorExcel() {
    const { errorUrl } = this.state;
    if (errorUrl) {
      let downUrl = G.serverUrl + '/' + errorUrl;
      let elink = document.createElement('a');
      let list = /[^/]+(?!.*xls)/.exec(errorUrl)[0];
      elink.download = list;
      elink.href = downUrl;
      elink.click();
    }
  }

  /**
   * @desc 获取人员列表数据
   */
  getPersons() {
    request('perArrange/getPerList', {}, res => {
      let res1 = {
        message: "commodo",
        result: true,
        data: {
          treeData: [
            {
              title: "院管理员", value: "wangjiang", isChecked: "0",
              children: [
                { title: "李立宇", value: "1", isChecked: "0" },
                { title: "李立宇1", value: "2", isChecked: "0" },
                { title: "李立宇2", value: "3", isChecked: "1" },
                { title: "李立宇3", value: "4", isChecked: "0" },
                { title: "李立宇4", value: "5", isChecked: "1" },
                { title: "李立宇5", value: "6", isChecked: "0" },
              ]
            },
            {
              title: "孤独西施", value: "gudu", isChecked: "0",
              children: []
            },
            {
              title: "安全检查员", value: "huaxi", isChecked: "0",
              children: [
                { title: "吴倩", value: "7", isChecked: "0" },
                { title: "吴倩1", value: "8", isChecked: "0" },
                { title: "吴倩2", value: "9", isChecked: "1" },
                { title: "吴倩3", value: "11", isChecked: "0" },
                { title: "吴倩4", value: "12", isChecked: "1" },
                { title: "吴倩5", value: "13", isChecked: "0" },
              ]
            },
            {
              title: "哈哈镜", value: "nali", isChecked: "1",
              children: [
                { title: "李洋", value: "45", isChecked: "1" },
                { title: "李洋1", value: "65", isChecked: "1" },
              ]
            }
          ],
          selectedData: [
            { title: "李立宇2", value: "3", parId: "wangjiang", },
            { title: "李立宇4", value: "5", parId: "wangjiang", },
            { title: "吴倩2", value: "9", parId: "huaxi", },
            { title: "吴倩4", value: "12", parId: "huaxi", },
            { title: "李洋", value: "45", parId: "nali" },
            { title: "李洋1", value: "65", parId: "nali" },
          ]
        },
      }
      if (res.result) {
        const { treeData, selectedData } = res.data;
        console.log('selectedData', selectedData)
        this.setState({
          personTree: treeData,
          personSele: selectedData,
          personVisible: true
        })
      } else {
        message.info(res.message);
      }
    })
  }

  /**
   * @desc 获取场所数据
   * @param {*} perId 人员id
   */
  getPlaces(perId) {
    request('perArrange/getPlaceList', { perId }, res => {
      let res1 = {
        message: "commodo",
        result: true,
        data: {
          treeData: [
            {
              title: "望江校区", value: "wangjiang", isChecked: "0",
              children: [
                { title: "励志楼", value: "1", isChecked: "0" },
                { title: "励志楼1", value: "2", isChecked: "0" },
                { title: "励志楼2", value: "3", isChecked: "1" },
                { title: "励志楼3", value: "4", isChecked: "0" },
                { title: "励志楼4", value: "5", isChecked: "1" },
                { title: "励志楼5", value: "6", isChecked: "0" },
              ]
            },
            {
              title: "孤独校区", value: "gudu", isChecked: "0",
              children: []
            },
            {
              title: "华西校区", value: "huaxi", isChecked: "0",
              children: [
                { title: "文学", value: "7", isChecked: "0" },
                { title: "文学1", value: "8", isChecked: "0" },
                { title: "文学2", value: "9", isChecked: "1" },
                { title: "文学3", value: "11", isChecked: "0" },
                { title: "文学4", value: "12", isChecked: "1" },
                { title: "文学5", value: "13", isChecked: "0" },
              ]
            },
            {
              title: "哪里校区", value: "nali", isChecked: "1",
              children: [
                { title: "科技", value: "45", isChecked: "1" },
                { title: "科技1", value: "65", isChecked: "1" },
              ]
            }
          ],
          selectedData: [
            { title: "励志楼2", value: "3", parId: "wangjiang", },
            { title: "励志楼4", value: "5", parId: "wangjiang", },
            { title: "文学2", value: "9", parId: "huaxi", },
            { title: "文学4", value: "12", parId: "huaxi", },
            { title: "科技", value: "45", parId: "nali" },
            { title: "科技1", value: "65", parId: "nali" },
          ]
        },
      }
      if (res.result) {
        const { treeData, selectedData } = res.data;
        this.setState({
          treeData,
          seleList: selectedData,
          perId,
          limitsVisible: true
        })
      } else {
        message.info(res.message);
      }
    })
  }

  /**
   * @desc 删除数据
   */
  deleTableData() {
    const { perId, pageIndex, tableData } = this.state;

    request('perArrange/deleListData', { perId }, res => {
      let res1 = {
        result: true,
      }
      if (res.result) {
        let page = 1;
        if (tableData.length === 1) {
          if (pageIndex === 1) {
            page = 1;
          } else {
            page = pageIndex - 1;
          }
        } else { page = pageIndex; }
        this.getTableData(page);
        this.setState({ pageIndex: page, deleVisible: false })

        let baseInfo = sessionStorage.getItem('baseinfo')
        if (baseInfo) {
          baseInfo = JSON.parse(baseInfo)
          let userId = baseInfo.userId
          if (userId === perId) {
            sessionStorage.setItem('zxArrangeFlag', JSON.stringify(false))
          }
        }
      } else {
        message.info(res.message);
        this.setState({ deleVisible: false })
      }
    })
  }

  /**
   * @desc 添加人员
   * @param {*} perList 人员id列表
   */
  savePerData(perList) {

    request('perArrange/savePerData', { perList }, res => {
      if (res.result) {
        message.info('添加成功');

        this.getTableData(1);
        this.setState({ personVisible: false, pageIndex: 1 })
      } else {
        message.info(res.message);
        this.setState({ personVisible: false })
      }
    })
  }

  /**
   * @desc 设置范围
   * @param {*} placeList 场所id列表
   */
  savePlaceData(placeList) {
    console.log('placeList', placeList)
    const { perId, pageIndex } = this.state;

    request('perArrange/savePlaceData', { perId, placeList }, res => {
      if (res.result) {
        this.getTableData(pageIndex);
      } else {
        message.info(res.message);
      }
      this.setState({
        limitsVisible: false,
        perId: ''
      })
    })
  }

  /**
   * @desc 设置范围弹窗
   */
  limitsVi(perId) {
    this.getPlaces(perId);
  }

  /**
   * @desc 设置范围弹窗按钮操作
   */
  modalVi(type, data) {
    // console.log(type, data);
    if (type === 'cancel') {
      this.setState({ limitsVisible: false })
    } else {
      this.savePlaceData(data);
    }
  }

  /**
   * @desc 添加人员弹窗
   */
  personVi() {
    this.getPersons();
    // this.setState({
    //   personVisible: true
    // })
  }

  /**
   * @desc 添加人员弹窗按钮操作
   */
  personBtn(type, data) {
    // console.log(type, data);
    if (type === 'cancel') {
      this.setState({ personVisible: false })
    } else {
      this.savePerData(data);
      // this.getTableData(1);
      // this.setState({ personVisible: false, pageIndex: 1 })
    }
  }

  /**
   * @desc 删除弹框
   * @param {*} perId 人员id
   */
  deleVi(perId) {
    this.setState({ deleVisible: true, perId })
  }

  /**
   * @desc 页码改变
   * @param {*} page 页码
   */
  pageChan(page) {
    this.getTableData(page);
    this.setState({ pageIndex: page })
  }

  /**
   * @desc 选择文件
   * @param {*} files 文件列表
   */
  fileChan(files) {
    // console.log(files);
    if (files.length && files[0].name) {
      let fileName = files[0].name;
      if (typeof (fileName) === 'string' && fileName.indexOf('.') > -1) {
        let args = fileName.split('.');
        if (args[args.length - 1] === 'xls' || args[args.length - 1] === 'xlsx') {
          this.setState({
            fileName,
            fileData: files[0]
          })
        } else {
          this.setState({
            fileName: '',
            fileData: undefined
          })
          message.info('请上传excel格式的文件');
        }
      } else {
        alert('传入参数必须为文件名且不能为空且必须为字符串！');
      }
    }
  }

  render() {
    const { limitsVisible, treeData, seleList, personVisible, personTree, personSele, tableData, total,
      pageIndex, pageSize, deleVisible, importVisible, fileName, leadInError } = this.state;
    const title = [
      { name: '姓名', id: 'perName' },
      { name: '巡课范围', id: 'sourExtent' },
      { name: '操作', id: 'option' },
    ];
    console.log('人员安排数据变化')
    return <div className='mj-rp-content'>
      <div className='mj-rp-titleCon'>
        <div className='mj-rp-title'>人员列表</div>
        <div className='mj-rp-btnCon'>
          <Button onClick={() => this.setState({ importVisible: true })} icon={<SVG type='dc' />}>导入安排</Button>
          <Button onClick={() => this.personVi()} icon={<SVG type='tj' />}>添加人员</Button>
        </div>
      </div>

      <div className='mj-rp-tableCon'>
        {
          tableData.length ?
            <div className='mj-p-tables'>
              <div className='mj-p-tableTitle mj-rp-tableTitle'>
                {
                  title.map(item => {
                    return <div key={item.id}>{item.name}</div>
                  })
                }
              </div>
              <div className='mj-rp-tableScroll'>
                <PerfectScrollbar>
                  {
                    tableData.map(item => {
                      return <div key={item.perId} className='mj-rp-table'>
                        <div>{item.perName}</div>
                        <div>{item.sourExtent}</div>
                        <div>
                          <span className='mj-rp-svg' onClick={() => this.limitsVi(item.perId)}>
                            <SVG type='ck' />
                            <span>设置范围</span>
                          </span>
                          <span className='mj-rp-svg' onClick={() => this.deleVi(item.perId)}>
                            <SVG type='sc' />
                            <span>删除</span>
                          </span>
                        </div>
                      </div>
                    })
                  }
                </PerfectScrollbar>
              </div>

              <div className='mj-p-pages'>
                <PagePonent
                  pageIndex={pageIndex}
                  pageSize={pageSize}
                  pageChan={(page) => this.pageChan(page)}
                  len={tableData && tableData.length || 0}
                  total={total} />
              </div>
            </div> :
            <div className='mj-rxq-noneData'>
              <img src={noneData} />
              <div>暂无数据</div>
            </div>
        }
      </div>

      {/* 删除 */}
      {
        deleVisible ?
          <ModalPonent
            title={'操作提示'}
            visible={deleVisible}
            onOk={() => this.deleTableData()}
            onCancel={() => this.setState({ deleVisible: false })}
            footer={{ ok: '确定', cancel: '取消' }}
            width={'610px'}
            content={
              <div style={{ paddingTop: 20, textAlign: 'center' }}>确定删除该人员？</div>
            }
          /> : null
      }

      {/* 添加人员 */}
      {
        personVisible ?
          <LimitsModal
            type='per'
            modalVi={(type, data) => this.personBtn(type, data)}
            treeData={personTree || []}
            selected={personSele || []}
            visible={personVisible} /> : null
      }

      {/* 设置范围 */}
      {
        limitsVisible ?
          <LimitsModal
            type='place'
            modalVi={(type, data) => this.modalVi(type, data)}
            treeData={treeData || []}
            selected={seleList || []}
            visible={limitsVisible} /> : null
      }

      {/* 导入 */}
      {
        importVisible ?
          <ModalPonent
            title={'导入安排'}
            visible={importVisible}
            onOk={() => this.leadInExcel()}
            onCancel={() => this.setState({ importVisible: false })}
            footer={{ ok: '导入', cancel: '取消' }}
            width={'500px'}
            content={
              <div className='mj-rp-importContent'>
                <div className='mj-rp-lineCon'>
                  <span>1</span>
                  <span></span>
                  <span>2</span>
                </div>
                <div className='mj-rp-txtCon'>
                  <div className='mj-rp-moduleTxt'>请下载巡课安排模板</div>
                  <div
                    onClick={() => this.downLoadModule()}
                    className='mj-rp-moduleCon'>
                    <SVG type='xiazai' />
                    <span>下载巡课安排模板</span>
                  </div>
                  <div className='mj-rp-excelTxt'>导入已有数据的巡课安排</div>
                  <div className='mj-rp-excelCon'>
                    <Button icon={<SVG type='tj' />}>选择文件</Button>
                    <input
                      // ref={(files) => this.files = files}
                      onChange={(e) => this.fileChan(e.target.files)}
                      className='mj-rp-file'
                      type='file' />
                    <span>{`${fileName}`}</span>
                  </div>
                </div>
              </div>
            }
          /> : null
      }

      {
        !leadInError ? null :
          <ModalPonent
            title="导入课程名单"
            centered={true}
            wrapClassName='mj-so-errorModal'
            visible={leadInError}
            width={'500px'}
            footer={null}
            onCancel={() => this.setState({ leadInError: false })}
            content={
              <div className='mj-rp-importErrorCon'>
                <img src={errorTip} />
                <p>数据文件有误</p>
                <div>
                  <SVG type='bg' />
                  <a
                    onClick={() => this.downErrorExcel()}>点击下载标出错误的EXCEL文件</a>
                </div>
              </div>
            }
          />
      }
    </div>
  }
}

export default Ryap;

/*
 * @Author:zxq
 * @Date: 2020-02-10 13:51:43 
 * @Last Modified by: zxq
 * @Last Modified time: 2020-02-10 17:28:26
 */

import React, { Component } from 'react';
import {  Table  } from 'antd';
import Fy from '../../../public/fy';
class DataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
                tableData: [],  //表格数据
                pageNum: 1,  //当前页码(0全部)
                pageSize: 10,  //条数
                total: 0,
                loading: false,
                buildList: true,   //表格显示状态        
        };
        // this.data=[];
        // for(let i=0;i<9;i++){
        //     this.data.push({
        //         teachingBuildId:i,
        //         teachingBuildName:"教学楼名称",
        //         classRoomCouRate:'教室开课率',
        //         classRoomUseRatio:'教室有效利用率',
        //         classRoomUsageRate:'教室闲时使用率',
               
        //     })
        // }
    }

    render() {
        const columns = [
            {
              title: '教室',
              dataIndex: 'classRoom',
              key: 'classRoom',
            
            
            },
            {
              title: '教室开课率',
              dataIndex: 'classRoomCouRate',
              key: 'classRoomCouRate',
            },
            {
              title: '教室有效利用率',
              dataIndex: 'classRoomUseRatio',
              key: 'classRoomUseRatio',
            },
            {
              title: '教室闲时使用率',
              key: 'classRoomUsageRate',
              dataIndex: 'classRoomUsageRate',
          
            },
         
          ];
          
          const data = [
            {
              key: '1',
              classRoom:'c101',
              classRoomCouRate: "90%",
              classRoomUseRatio:"98%",
              classRoomUsageRate:"10%",
            },
            {
              key: '2',
              teachingBuildName:'c101',
              classRoomCouRate: "90%",
              classRoomUseRatio:"98%",
              classRoomUsageRate:"10%",
            },
            {
              key: '3',
              teachingBuildName:'c101',
              classRoomCouRate: "90%",
              classRoomUseRatio:"98%",
              classRoomUsageRate:"10%",
            },
            {
                key: '4',
                teachingBuildName:'c101',
                classRoomCouRate: "90%",
                classRoomUseRatio:"98%",
                classRoomUsageRate:"10%",
              },
              {
                key: '5',
                teachingBuildName:'c101',
                classRoomCouRate: "90%",
                classRoomUseRatio:"98%",
                classRoomUsageRate:"10%",
              },
              {
                key: '6',
                teachingBuildName:'c101',
                classRoomCouRate: "90%",
                classRoomUseRatio:"98%",
                classRoomUsageRate:"10%",
              },
              {
                key: '7',
                teachingBuildName:'c101',
                classRoomCouRate: "90%",
                classRoomUseRatio:"98%",
                classRoomUsageRate:"10%",
              },
          ];
        let List={
          pageNum: 1, 
          pageSize: 20  //每页条数
        }
       let {buildList} = this.state;
        return (
          <>
           { buildList ?  <div className="zxq-table">              
          <div className="zxq-search"> 教室：<input placeholder="请选择/搜索"/></div>
          <div className="zxq-tabDownload">下载</div>
          <div className="zxq-tableContent">
              <div className="zxq-antTable">
                  {/* <Table columns={columns} dataSource={data} pagination={false}/> */}

                  <Table
                      columns={columns}
                      dataSource={data}
                      // loading={loading}
                      rowKey={(record, index) => index}
                      pagination={false}
                  />

                 
                    <Fy
                          pageSize={List.pageSize}
                          pageIndex={List.pageNum}
                          total={400}
                          // jumpPage={this.jumpPage.bind(this)}
                      />
              </div>
          
              
          </div>
      </div>

           
           
  : 
  <div>

  </div>
  }
          </>
         
           
        );
    }
}

export default DataTable;
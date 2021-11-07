/*
 * @Author: xq 
 * @Date: 2021-01-08 13:26:08 
 * @Last Modified by: yhc
 * @Last Modified time: 2021-04-28 17:02:02
 * @desc 住宿管理 - 房间规则 - 宿舍管理员设置
 */
import React,{useState,useEffect} from 'react'
import { withRouter } from 'react-router-dom'
import { PublicTbs,PaginationPonent,InitScroll } from './../../components/common'
import { RuleManageTable } from './../../components/roomManageRule/ruleManageTable'
import { message,Spin} from 'antd';
import { getRuleManage_request } from './../../../request/page-room/ruleManage'
import './../../../style/ruleManage.scss'

export default withRouter( props => {
    const [pageIdx,setPageIdx] = useState(1);
    const [list,setList] = useState([]);
    const [total,setTotal] = useState(0);
    const [loading,setLoading] = useState(true);
 
    useEffect(()=>{
        getList();
    },[])

    /**
     * @desc 列表获取
     * @param {number} idx 页码索引
     */
    const getList = async (idx) => {
        let _idx = typeof idx === 'number' ? idx : pageIdx
        let param = {
            pageSize:20,
            pageIndex:_idx
        }
        setLoading(true)
        let resData = await getRuleManage_request(param);
        if(resData.result ){
            if(resData.data.list && resData.data.list.length > 0){
                setList(resData.data.list)
                setTotal(resData.data.total)
                InitScroll()
            } else {
                setList([]);
                setTotal(0);
            }
            setPageIdx(_idx)
        } else {
            message.warning(resData.message)
        }
        setLoading(false)
    }

    const idxChange = idx => {
        setPageIdx(idx);
        getList(idx)
    } 

    return <Spin tip={'数据加载中...'} spinning={loading} wrapperClassName='xq-rule-con' size='large'>
            <PublicTbs menuPath={['room','rule','manageRule']} />
            <RuleManageTable 
                loading={loading}
                data={list}
                initList={() => getList(1)}
            />
            {
                !loading
                ?<PaginationPonent
                    pageIndex={pageIdx}
                    pageSize={20}
                    total={total}
                    pageChange={value => idxChange(value)}
                />
                :null
            }
        </Spin>
})

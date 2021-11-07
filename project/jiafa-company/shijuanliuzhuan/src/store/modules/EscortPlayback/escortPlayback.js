import Vue from 'vue'
import { getStore } from "@/utils/util.js";
import { queryEscortPlayback, confirmEscortPlayback } from '@/http/modules/escortPlayback.js'
import { message } from "ant-design-vue";
export default {
    namespaced: true,
    state: {
        filterInfo: {
            orgCode:'', //查询机构id
            replayResult: '', //查询回放结果
            keyword: '', // 搜索关键字
            pageIndex: 1,
            pageSize: 10,
        },
        lists: [],
        total: 0,
        isLoading:false,
        savaInfo: {

        },
        
    },
    getters: {

    },
    mutations: {
        queryEscortPlaybackMut(state, payload) {
            state.lists = payload.list
            state.total = payload.total
        },
        save(state, payload) {
            state.savaInfo = payload;
        },
        resetFilterInfo(state,payload){
            state.filterInfo = {
                orgCode: JSON.parse(getStore('userInfo')).orgcode, //查询机构id
                replayResult: '', //查询回放结果
                keyword: '', // 搜索关键字
                pageIndex: 1,
                pageSize: 10,
            }
        }

    },
    actions: {
        //查询
        queryEscortPlaybackAsync(context, payload) {
            context.state.isLoading = true
            queryEscortPlayback(context.state.filterInfo).then(res => {
                context.state.isLoading = false
                if (res.result) { 
                    context.commit('queryEscortPlaybackMut', res.data)
                } else {
                    message.error(res.message);
                }  
            }).catch(res =>{
                context.state.isLoading = false
                message.error("请求错误！"+ res)
            })
        },
        //确认
        confirmEscortPlaybackAsync(context, payload) {
            confirmEscortPlayback(context.state.savaInfo).then(res => {
                if (res.result) {
                    message.success('保存成功')
                    context.dispatch('queryEscortPlaybackAsync')
                } else{
                    message.error("保存失败"+ res.message)
                }
                // payload(res.result) 
            }).catch(err=>{
                message.error("请求错误"+ err)
            })
        }
    }
}
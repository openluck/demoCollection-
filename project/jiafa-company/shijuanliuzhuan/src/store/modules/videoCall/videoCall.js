import Vue from 'vue'
// import { getStore } from '@/utils/util.js'
import { askMobileVideo } from '@/http/modules/videoCall.js'
import { message } from "ant-design-vue";
export default {
    namespaced:true,
    state: {
        isStart:false
    },
    getter: {

    },
    mutations: {
        changeIsStart(state,payload){
            state.isStart = payload
        }
    },
    actions: {
        askMobileVideoAsync(context,payload){
            context.commit('changeIsStart',false)
            askMobileVideo(payload).then(res=>{   
              if(payload.type === 2){
                if(res.result){
                  setTimeout(()=>{
                    context.commit('changeIsStart',true)
                    message.success('请求视频成功~')
                  },1000)  
                }
              }  
            }).catch(err=>{
                message.error('操作失败!')
            })
        },
    }
}


<template>
    <div class="tasklog">
        <a-timeline>
            <div v-if="list.length">
                <a-timeline-item v-for="(item,index) in list" :key='index' color="blue">
                    <p>{{item.time}}</p>
                    <h1>{{item.operation}}</h1>
                    <p class="remark">{{item.remark}}</p>
                </a-timeline-item>
            </div>
            <div v-else>当前暂无信息</div>
            <!-- <a-timeline-item color="blue">
                <p>2020年6月1日13:22:57</p>
                <h1>确认任务</h1>
                <p class="remark"></p>
            </a-timeline-item>
            <a-timeline-item color="blue">
                <p>2020年6月1日13:22:57</p>
                <h1>开始押运</h1>
                <p class="remark"></p>
            </a-timeline-item>
            <a-timeline-item color="red">
                <p>2020年6月1日13:22:57</p>
                <h1>人员变动</h1>
                <a-icon slot="dot" type="exclamation-circle" style="font-size: 20px;" />
                <div class="personchange">
                    我单位群 → 达瓦大
                </div>
                <p class="remark"></p>
            </a-timeline-item>
            <a-timeline-item color="green">
                <p>2020年6月1日13:22:57</p>
                <h1>完成押运</h1>
                <a-icon slot="dot" type="check-circle" style="font-size: 20px;" />
                <p class="remark"></p>
            </a-timeline-item>
            <a-timeline-item color="green">
                <p></p>
                <h1></h1>
                <p class="remark"></p>
            </a-timeline-item> -->
        </a-timeline>
    </div>
</template>

<script>
import Vue from 'vue'
import { getTaskLog } from '@/http/modules/escortPlan.js' 
import { Timeline } from 'ant-design-vue'
Vue.use(Timeline)
export default {
    name:'TaskLog',
    components:{},
    props:{
        taskId:{
            type:String,
            required:true,
        },
    },
    data() {
        return {
            list:[]
        }
    },
    mounted(){
        this.getTaskLogMethod()
    },
    methods:{
        getTaskLogMethod(){
            const { taskId } = this 
            getTaskLog({ taskId }).then(res => {
                // console.log(res);
                if(res.result){
                    this.list = res.data
                }
            }).catch(err => {
                console.error(err)
            })
        }
    }
    
}
</script>

<style lang="less" >
.tasklog{
    margin-left: 10px;
    p{
        font-size: 14px;
    }
    h1{
        font-size: 16px;
        font-weight: bold;
    }
   .personchange{
        width: 160px;
        height: 30px;
        padding: 0px 10px;
        margin: 10px 0px;
        border: 1px solid red;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .remark{
        font-size: 12px;
    } 
}
    
</style>
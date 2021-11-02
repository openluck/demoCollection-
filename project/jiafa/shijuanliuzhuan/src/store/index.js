import Vue from 'vue';
import Vuex from 'vuex';

// import todayOutbreak from './todayOutbreak'; //今日疫情

Vue.use(Vuex);
import app from './modules/app'
import escortAlarm from './modules/EscortTaskAdmin/escortAlarm'
import escortPlan from './modules/escortplan/escortPlan'
import escortTask from './modules/escortTask/escortTask'
import workRequireMent from './modules/workRequireMent/workRequireMent'  //工作要求设置
import escortPlayback from './modules/EscortPlayback/escortPlayback' //查询押运回放记录
import videoCall from './modules/videoCall/videoCall'
 
export default new Vuex.Store({
    modules: {
        // todayOutbreak,
        app,
        escortAlarm,
        escortPlan,
        escortTask,
        workRequireMent,
        escortPlayback,
        videoCall,
    }
})
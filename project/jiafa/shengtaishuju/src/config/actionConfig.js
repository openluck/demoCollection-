/*
 * @Author: mikey.zhaopeng 
 * @Date: 2020-02-14 10:39:35 
 * @Last Modified by: tj
 * @Last Modified time: 2021-02-05 10:34:22
 * 行为分析等文件配置
 */

/**
 * 根据配置处理数据
 * @param {I} data 
 * @param {*} id 1: 教师行为 2:教学设计 3:课堂类型 4:学生行为 5:学生表情 6:综合情况 7：考勤情况
 */
export const getConfigData = (data, id) => {
    let filedObj;
    if (id) {
        filedObj = getFiledCnt(id);
        // 遍历获取数据
        data.map(dt => {
            // 每项数据填入对应数组
            Object.keys(filedObj).forEach((item) => {
                if (typeof filedObj[item] === 'object') {
                    let date = filedObj[item].date;
                    let num = filedObj[item].num;
                    date.push(dt.date)
                    num.push(dt[item])
                }

            })
        });
        return filedObj;
        // console.log(filedObj)
    }
}

/**
 * 从配置中获取对象
 * @param {Number} ind id
 */
export const getFiledCnt = (ind) => {
    if (ind && ind < 8) {
        let cnt = actionConfig[ind - 1];
        // 添加字段
        Object.keys(cnt).forEach((item) => {
            Object.assign(cnt[item], { date: [], num: [] })
        })
        return cnt;
    } else {
        console.log('传入类型有误')
    }
}


/**
 * 从考勤状态中获取值
 * @param {*} code 状态code
 */
export const getAttCodeName=(code)=>{
    let keyCode=String(code)
    let obj;
    attConfig.map(item=>{
        if(keyCode===item.value){
            obj=item
        }
    })
    if(obj&&obj.name){
        return obj.name
    }else{
        return '--'
    }
}

const attConfig = [
    {name: '正常', value: '1'}, 
    {name: '迟到', value: '2'}, 
    {name: '早退', value: '3'}, 
    {name: '缺勤', value: '4'}, 
    {name: '调换课', value: '5'}, 
    {name: '请假', value: '6'}, 
    {name: '迟到并且早退', value: '7'}, 
 ]

const actionConfig = [{
    parName: '教师行为',
    // parKey: 'teacherBehavior',
    boardWrite: { name: '板书', },
    patrol: { name: '巡视', },
    media: { name: '多媒体', }
}, {
    parName: '教学设计',
    // parKey: 'teachDesign',
    stuLearn: { name: '学生自习', },
    stuInteract: { name: '生生互动', },
    tsInteract: { name: '师生互动', },
    teaching: { name: '教师讲授', },
    stuShow: { name: '学生展示', }
}, {
    parName: '课堂类型',
    // parKey: 'couType',
    teachingT: { name: '讲授型' },
    chatT: { name: '对话型' },
    mixT: { name: '混合型' },
    exeT: { name: '练习型' }
}, {
    parName: '学生行为',
    // parKey: 'stuBehavior',
    read: { name: '阅读' },
    write: { name: '书写' },
    listen: { name: '听讲' },
    handUp: { name: '举手' },
    standUp: { name: '起立' },
    playPhone: { name: '玩手机' },
    onTable: { name: '趴桌子' }
}, {
    parName: '学生表情',
    // parKey: 'face',
    happy: { name: '高兴' },
    scare: { name: '害怕' },
    neuter: { name: '中性' },
    amzed: { name: '惊讶' },
    anger: { name: '愤怒' },
    sad: { name: '难过' },
    detest: { name: '厌恶' }
}, {
    parName: '综合情况',
    // parKey: 'situation',
    involvement: { name: '参与度' },
    concentration: { name: '专注度' },
    activation: { name: '活跃度' },
    distrust: { name: '疑惑度' }
}, {
    parName: '考勤分布',
    // parKey: 'attenStatus',
    teaAttNormal: { name: '正常' },
    teaAttExchange: { name: '调换课' },
    teaAttLate: { name: '迟到' },
    teaEarly: { name: '早退' },
    teaAttAbsence: { name: '缺勤' },
    leave: { name: '请假' },
}]




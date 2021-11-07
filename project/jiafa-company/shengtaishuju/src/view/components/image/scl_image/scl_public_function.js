/*
 * @Author: lj
 * @Date: 2020-02-14 10:39:35 
 * @Last Modified by: lj
 * @Last Modified time: 2020-02-20 11:52:13
 * 公共方法
 */

/**
 * 学校趋势数据处理
 * @param {} oldQsData  已经存储的趋势数据
 * @param {} newQsData  接口返回的趋势数据
 * @param {} index      selectIndex
 */
import _ from 'lodash';
export const getQsData = (oldQsData, newQsData, index, name, id, selData) => {
    // console.log(index)
    if (index == 0 && JSON.stringify(oldQsData) == "{}") {
        // 处理全部项数据
        let qsData = { xData: [], color: ['#3385ff'], yData: [{ name: '全校', id: newQsData.id, list: [] }] };
        if (newQsData && newQsData.lineList.length !== 0) {
            newQsData.lineList.map((t, i) => {
                qsData.xData.push(t.name)
                qsData.yData[0].list.push(t.prop)
            })
        }
        return qsData;
    } else {
        // 处理下拉选择获取的数据
        let obj = {
            name: name,
            id: newQsData.id,
            list: []
        }
        let date = oldQsData.xData; // 日期
        let data = newQsData.lineList;
        obj.name = name;
        obj.id = id;
        date.map((t, i) => {
            let ind = _.findIndex(data, { name: t })
            if (ind == -1) {
                obj.list[i] = '--'
            } else {
                obj.list[i] = data[ind].prop
            }
        })
        // 2020-07-15 修改判断两个下拉同时满足条件修改数据
        // 已存在折线图
        let t = _.findIndex(selData, { collegeId: newQsData.id }); // 下拉选中项查询

        if (t > 0) {
            oldQsData.yData[t] = obj
        } else if(index === 0) {
            oldQsData.yData[0] = obj
        }
        // 注释原逻辑
        // oldQsData.yData[index] = obj;
        // for (let i = 0; i < oldQsData.yData.length; i++) {
        //     if (!oldQsData.yData[i]) {
        //         oldQsData.yData.splice(i, 1);
        //     }
        // }
        return oldQsData;
    }
}

/**
 * 学院趋势数据处理
 * @param {} oldQsData  已经存储的趋势数据
 * @param {} newQsData  接口返回的趋势数据
 * @param {} index      selectIndex
 */
export const getXyQsData = (oldQsData, newQsData, index, name, id, selData) => {
    if (index == 0 && JSON.stringify(oldQsData) == "{}") {
        // 处理全部项数据
        let qsData = { xData: [], data: [{ name: '全部', id: newQsData.id, list: [] }] };
        if (newQsData && newQsData.lineList.length !== 0) {
            newQsData.lineList.map((t, i) => {
                qsData.xData.push(t.name)
                qsData.data[0].list.push(t.prop)
            })
        }
        return qsData;
    } else {
        // 处理下拉选择获取的数据
        let obj = {
            name: name,
            id: newQsData.id,
            list: []
        }
        obj.name = name;
        obj.id = id;
        // 旧数据
        let date = oldQsData.xData;
        // 每项数据
        let data = newQsData.lineList;
        // date.map((t, i) => {
        //     let index = _.findIndex(newQsData.lineList, { name: t })
        //     if (index == -1) {
        //         obj.list[i] = 0
        //     } else {
        //         obj.list[i] = data[index].prop
        //     }
        // })
        date.map((t, i) => {
            let ind = _.findIndex(data, { name: t })
            if (ind == -1) {
                obj.list[i] = '--'
            } else {
                obj.list[i] = data[ind].prop
            }
        })
        // 2020-07-15 修改判断两个下拉同时满足条件修改数据
        // 已存在折线图
        console.log(selData,newQsData.id)
        let t = _.findIndex(selData, { courseId: newQsData.id }); // 下拉选中项查询
        console.log(oldQsData)
        if (t > 0) {
            oldQsData.data[t] = obj
        } else if(index === 0) {
            oldQsData.data[0] = obj
        }
        // oldQsData.data[index] = obj;
        // for (let i = 0; i < oldQsData.data.length; i++) {
        //     if (!oldQsData.data[i]) {
        //         oldQsData.data.splice(i, 1);
        //     }
        // }
        return oldQsData;
    }
}

export const realData = (val) => {
    if (val == null || val == undefined || val === "" || val == "null" || val == 'undefined') {
        return '--';
    } else if (val == 0 || val == '0') {
        return val;
    }
    else {
        return val.toFixed(2);
    }
}


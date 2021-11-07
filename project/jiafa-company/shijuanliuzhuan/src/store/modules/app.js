import { tempdir } from "shelljs";
import { filterArray, _sort, getArrayObj1 } from "../../utils/util.js";
export default {
    // namespaced: true,
    state: {
        orgs: [],
        orgTree: [], //全省机构树数组结构
        orgTreeB: [],
        orgsAll: [],  //全省机构树树形
        sessionSubjects: [],
        systemConf: {
            escortStatus: []
        }
    },
    getters: {

    },
    mutations: {
        setOrgs(state, orgs) {
            let currentOrgCode = JSON.parse(sessionStorage.getItem('userInfo')).orgcode;
            //获取当前机构的父级code,parentCode
            let getObjParantId = getArrayObj1(orgs, currentOrgCode).parentCode
            //对机构数组的对象格式化成antd树要求格式的对象
            orgs = orgs.map(item => ({ ...item, key: item.orgCode, value: item.orgCode, title: item.orgName }))       //？数据结构没发生变化，重新组装？？

            let obj01 = getArrayObj1(orgs, '01')
            let obj02 = getArrayObj1(orgs, '02')
            state.orgs = filterArray(orgs, getObjParantId)
            if (getObjParantId) {
                state.orgs.push(obj01, obj02)
            }
            state.orgs = state.orgs.filter(i => i)
            // state.orgs = state.orgs[state.orgs.length-1]
            let temp = [];
            temp.push(state.orgs[0])
            state.orgs = temp;
            // console.log(temp);
            _sort(state.orgs)
        },
        setOrgs1(state, orgs) {
            let currentOrgCode = JSON.parse(sessionStorage.getItem('userInfo')).orgcode;
            let getObjParantId = getArrayObj1(orgs, currentOrgCode).parentCode
            orgs = orgs.map(item => ({ ...item, key: item.orgCode, value: item.orgCode, title: item.orgName }))
            let obj01 = getArrayObj1(orgs, '01')
            let obj02 = getArrayObj1(orgs, '02')
            state.orgTree = orgs
            state.orgsAll = filterArray(orgs, getObjParantId)
            if (getObjParantId) {
                state.orgsAll.push(obj01, obj02)
            }
            state.orgsAll = state.orgsAll.filter(i => i)
            let temp = [];
            temp.push(state.orgsAll[0])
            state.orgsAll = temp;
            _sort(state.orgsAll)
        },
        setOrgTree(state, orgTree) {
            state.orgTree = orgTree
        },
        setSessionAndSubject(state, sessionSubjects) {
            state.sessionSubjects = sessionSubjects;
        },
        setSystemConf(state, payload) {
            state.systemConf = payload;
        },
        forGetItem(state, id) {

            console.log(id)
            console.log('===' + state.orgTree);

            for (let i = 0; i < state.orgTree.length; i++) {

                if (state.orgTree[i].orgCode == id) {
                    console.log(state.orgTree[i])
                    return state.orgTree[i]
                }

            }
        }
    },
    actions: {

    }
}
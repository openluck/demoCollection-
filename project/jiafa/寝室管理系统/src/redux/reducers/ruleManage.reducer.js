/*
 * @Author: xq 
 * @Date: 2021-01-21 09:25:03 
 * @Last Modified by:   xq 
 * @Last Modified time: 2021-01-21 09:25:03 
 * 房间规则 - 宿舍管理员设置
 */
export const ruleManageTree_reducer = (state = {}, { type, data }) => {
    switch (type) {
        case "RULE_MANAGERULE_TREE": {
            return { ...data };
        }
        default: {
            return state;
        }
    }
};
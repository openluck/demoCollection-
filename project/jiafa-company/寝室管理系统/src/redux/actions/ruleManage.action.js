/*
 * @Author: xq 
 * @Date: 2021-01-21 09:27:52 
 * @Last Modified by: xq
 * @Last Modified time: 2021-01-21 10:20:07
 */


export const ruleManageTree_action = (tree = []) => {
    return {
      type: "RULE_MANAGERULE_TREE",
      data: tree,
    };
};
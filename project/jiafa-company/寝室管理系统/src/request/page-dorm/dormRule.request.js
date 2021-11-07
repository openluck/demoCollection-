/*
 * @Author: junjie.lean
 * @Date: 2021-01-25 10:11:25
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-02-07 10:13:55
 */

import { request as Ajax } from "./../../util/request";

//人员组接口:
export const getPersonGroupList_request = async (pr = {}) => {
  return Ajax("dormitory/getPersonGroupList", pr).then(({ data }) => data);
};

export const deletePersonGroup_request = async (pr = {}) => {
  return Ajax("dormitory/deletePersonGroup", pr).then(({ data }) => data);
};

export const getGroupDetail_request = async (pr = {}) => {
  return Ajax("dormitory/getGroupDetail", pr).then(({ data }) => data);
};

export const submitGroupDetial_request = async (pr = {}) => {
  return Ajax("dormitory/createPersonList", pr).then(({ data }) => data);
};

export const getDefaultGroupData_request = async (pr = {}) => {
  return Ajax("dormitory/getDefaultGradeAndClassList", pr).then(
    ({ data }) => data
  );
};
//人员组接口结束

//在寝规则接口:
export const getManageTime_request = async (pr = {}) => {
  return Ajax("dormitory/getManageTime", pr).then(({ data }) => data);
};

export const updateManageState_request = async (pr = {}) => {
  return Ajax("dormitory/updateManageState", pr).then(({ data }) => data);
};

export const updateManageTime_requeist = async (pr = {}) => {
  return Ajax("dormitory/updateManageTime", pr).then(({ data }) => data);
};
//在寝规则接口结束

//例外计划接口:
export const getManageRuleList_request = async (pr = {}) => {
  return Ajax("dormitory/getManageRuleList", pr).then(({ data }) => data);
};

export const addManageRule_request = async (pr = {}) => {
  return Ajax("dormitory/addManageRule", pr).then(({ data }) => data);
};

export const deleteManageRule_request = async (pr = {}) => {
  return Ajax("dormitory/deleteManageRule", pr).then(({ data }) => data);
};

export const getExceptiveList_request = async (pr = {}) => {
  return Ajax("dormitory/getExceptiveList", pr).then(({ data }) => data);
};

export const getManagePlanDetail_request = async (pr = {}) => {
  return Ajax("dormitory/getManagePlanDetail", pr).then(({ data }) => data);
};

export const addExceptive_request = async (pr = {}) => {
  return Ajax("dormitory/addExceptive", pr).then(({ data }) => data);
};

export const updateManagePlan_request = async (pr = {}) => {
  return Ajax("dormitory/updateManagePlan", pr).then(({ data }) => data);
};

export const deleteExceptive_request = async (pr = {}) => {
  return Ajax("dormitory/deleteExceptiveList", pr).then(({ data }) => data);
};

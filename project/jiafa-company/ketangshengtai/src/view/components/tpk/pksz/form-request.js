/*
 * @Author: junjie.lean
 * @Date: 2020-02-17 11:35:56
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-07-24 09:27:04
 */

/**
 * form相关的请求
 */

import { requestForListen} from "./../../../../util/request";

const Ajax = requestForListen;

export function getFormList() {
  const pr = {
    pageIndex: 1,
    pageSize: 20
  };
  return Ajax("get/modalInfo", pr).then(({ data }) => data);
}

export function getDOMJsonByClassId(classID, jobID, perID, courseID) {
  const pr = { classID, jobID, perID, courseID };
  return Ajax("get/getFormByClass", pr).then(({ data }) => data);
}

export function getDOMJsonByFormId(formID) {
  const pr = { formID };
  return Ajax("get/getFormByID", pr).then(({ data }) => data);
}

export function commitDOMJson(pr) {
  return Ajax("commit/formDataCommit", pr).then(({ data }) => data);
}

export function formEdit(pr) {
  return Ajax("commit/formDesign", pr).then(({ data }) => data);
}

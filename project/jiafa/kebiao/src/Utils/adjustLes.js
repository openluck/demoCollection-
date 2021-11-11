/*
 * @Desc:
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-08-26 18:00:54
 * @LastEditors: went
 * @LastEditTime: 2021-08-26 18:08:49
 */
import moment from "moment";
/**
 * @desc: 设置金庸时间
 * @param {*} current
 * @author: went
 */

function disabledDate(current) {
  let nowSemester = JSON.parse(sessionStorage.getItem("nowSemester"));
  return (
    moment(nowSemester.semesterEndTime) < current ||
    current < moment(nowSemester.semesterStartTime)
  );
}

export { disabledDate };

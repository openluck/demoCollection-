/*
 * @Desc:
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-08-02 15:28:59
 * @LastEditors: went
 * @LastEditTime: 2021-08-13 10:27:26
 */
import axios from "../../axios";

// 调换课调整-调换课表
export const setSwitchTimetable = (data) => {
  return axios({
    url: "/timetableAdjust/setSwitchTimetable",
    method: "post",
    data,
  });
};

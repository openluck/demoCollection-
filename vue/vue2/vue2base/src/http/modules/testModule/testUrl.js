/*
 * @Descripttion: 各个api的地址
 * @version:
 * @Author: OpenLcuk
 * @Date: 2021-10-13 16:46:12
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-13 16:47:19
 */
// 导入axios
import axios from "../../axios";

export const testUrl1 = (data) => {
  return axios({
    url: "aaaa",
    method: "post",
    data,
  });
};

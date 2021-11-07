/*
 * @Author: junjie.lean
 * @Date: 2020-03-18 11:00:34
 * @Last Modified by: mzc
 * @Last Modified time: 2021-10-12 17:19:40
 */
import React, { useEffect } from "react";
import ReactLoading from "react-loading";
import { request } from "./../../util/request";

export default function Loading(props) {
  // console.log('loading');
  useEffect(() => {
    new Promise((resolve) => {
      Promise.all([
        // 获取创建者
        // request('public/builderList', {}, res => { }),
        // 获取任务类型
        // request('public/taskType', {}, res => { }),
        // 获取系统名称
        request("api/web/project/get_name", {}, (res) => {}),
        // 获取学期数据
        request("public/semester", {}, (res) => {}),
      ])
        .then((values) => {
          // console.log(values);
          if (values && values.length) {
            values.map((item, index) => {
              switch (index) {
                case 1:
                  let ret = item.data;
                  let list = [],
                    semesterNow = {},
                    currentWeek = "";
                  if (ret.result && ret.data && ret.data.length) {
                    list = ret.data;
                    semesterNow = _.find(list, { isNow: 3 }) || list[0];

                    let weeks = semesterNow.weeks,
                      day = new Date().getTime();
                    let index = _.findIndex(weeks, function (item) {
                      let start = new Date(item.startTime).getTime(),
                        end = new Date(item.endTime).getTime();
                      return start < day && day < end;
                    });
                    currentWeek = index != -1 ? weeks[index].id : 1;
                    // console.log(currentWeek);
                  } else {
                    list = [];
                  }
                  G.semesters = list;
                  G.semester = semesterNow;
                  G.currentWeek = currentWeek;
                  sessionStorage.setItem("semesters", JSON.stringify(list));
                  sessionStorage.setItem(
                    "semester",
                    JSON.stringify(semesterNow)
                  );
                  sessionStorage.setItem("currentWeek", currentWeek);
                  break;

                // case 0:
                //   let ret1 = item.data;
                //   let list1 = [];
                //   if (ret1.result && ret1.data && ret1.data.length) {
                //     list1 = ret1.data;
                //   } else {
                //     list1 = [];
                //   }
                //   G.builderList = list1;
                //   sessionStorage.setItem('builderList', JSON.stringify(list1));
                //   break;

                // case 1:
                //   let ret2 = item.data;
                //   let list2 = [];
                //   if (ret2.result && ret2.data && ret2.data.length) {
                //     list2 = ret2.data;
                //   } else {
                //     list2 = [];
                //   }
                //   G.taskTypeList = list2;
                //   sessionStorage.setItem('taskTypeList', JSON.stringify(list2));
                //   break;

                case 0:
                  let sysRes = item.data,
                    sysData = "";
                  if (sysRes.result) {
                    sysData = sysRes.data || "课堂生态平台";
                  } else {
                    sysData = "课堂生态平台";
                  }
                  G.systemname = sysData;
                  sessionStorage.setItem("systemname", sysData);
                  break;
                default:
                  break;
              }
            });
            sessionStorage.setItem("G", JSON.stringify(G));
          } else {
            message.error("全局信息获取错误，请重新登录", 2, () => {
              window.close();
            });
          }
        })
        .then(() => {
          props.history.push("/home");
        });
    });
  }, []);

  return (
    <div
      style={{
        padding: "10%",
        width: "100%",
        height: "100%",
      }}
    >
      <ReactLoading type={"bars"} color="#30bf99" />
    </div>
  );
}

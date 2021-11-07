import React, { useState, useEffect } from "react";
import { request } from "../../../../util/request";
import { message, Spin } from "antd";
import Zxxk from "./zxxke";
import "./../../../../style/zxxk/zxxk/zxxkAuth.scss";

const ZxxkAuth = (props) => {
  const [loading, setLoading] = useState(true);
  const [flag, setFlag] = useState(false);
  const JudgeZxArrage = () => {
    request(
      "perArrange/getArrangeList",
      { pageIndex: 1, pageSize: 2000 },
      (res) => {
        let baseinfo = sessionStorage.getItem("baseinfo");
        let userId = "";
        if (baseinfo) {
          baseinfo = JSON.parse(baseinfo);
          userId = baseinfo.userId;
        }
        if (res.result) {
          let data = res.data;
          if (data && data[0]) {
            let one = data.find((item) => {
              return item.perId === userId;
            });
            if (one && one.sourExtent) {
              setFlag(true);
            }
          }
          setLoading(false);
        } else {
          message.warning(data.message);
        }
      }
    );
  };
  useEffect(() => {
    JudgeZxArrage();
  }, []);
  return loading ? (
    <div className="xm-zxArrangeBoxLoading">
      <Spin size="middle" />
      <span>loading...</span>
    </div>
  ) : flag ? (
    <Zxxk />
  ) : (
    <div className="xm-zxArrangeBox">
      <img src={no_permission} alt="" />
      <div className="xm-zxArrange">
        <div>
          <p>您没有巡课安排</p>
          <p>
            请联系<span>系统管理员</span>
          </p>
        </div>
        <div>拥有巡课安排，可以进行以下操作：</div>
        <div>1.查看教室课程直播、回放视频画面；</div>
        <div>2.记录教室违纪事件。</div>
      </div>
    </div>
  );
};

export default ZxxkAuth;

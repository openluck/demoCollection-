import React, { useState, useEffect } from "react";
import { request } from "../../../../util/request";
import { message, Spin } from "antd";
import Rgaq from "./rgaqjc";
import "./../../../../style/pajs/aqjc/rgaqjcAuth.scss";

const RgaqjcAuth = (props) => {
  const [loading, setLoading] = useState(true);
  const [flag, setFlag] = useState(true);
  const JudgeRgArrage = () => {
    request("userSet/getUserList", { pageIndex: 1, pageSize: 2000 }, (res) => {
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
            return item.userId === userId;
          });
          if (one && one.range) {
            setFlag(true);
          }
        }
        setLoading(false);
      } else {
        message.warning(data.message);
      }
    });
  };
  useEffect(() => {
    JudgeRgArrage();
  }, []);
  return loading ? (
    <div className="xm-rgArrangeBoxLoading">
      <Spin size="middle" />
      <span>loading...</span>
    </div>
  ) : flag ? (
    <Rgaq />
  ) : (
    <div className="xm-rgArrangeBox">
      <img src={no_permission} alt="" />
      <div className="xm-rgArrange">
        <div>
          <p>您没有安全检查安排</p>
          <p>
            请联系<span>系统管理员</span>
          </p>
        </div>
        <div>拥有安全检查安排，可以进行以下操作：</div>
        <div>1.查看教室课程直播、回放视频画面；</div>
        <div>2.记录教室安全事件。</div>
      </div>
    </div>
  );
};

export default RgaqjcAuth;

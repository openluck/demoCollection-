import React, { useEffect, useState } from "react";
import Vlc from "./../../../vlcVideo/vlc";
import "./VlcVideo.scss";
import { Select } from "antd";

export default function VlcVideo(props) {
  const { urlList, width, height } = props;
  const [src, setSrc] = useState("");
  const [id, setId] = useState("");
  useEffect(() => {
    if (urlList.length) {
      setSrc(urlList[0].url);
      setId(urlList[0].id);
    }
    console.log("urlList", urlList);
  }, [urlList]);
  const onChange = (id) => {
    let urlInfo = urlList.find((item) => item.id === id);
    setSrc(urlInfo.url);
    setId(id);
  };
  return (
    <div className="mzc-vlcVideo" style={{ width, height }}>
      <div
        style={{
          display: urlList.length ? "block" : "none",
        }}
        className="mzc-vlcVideoSl"
      >
        <Select
          className="mzc-sl"
          onChange={onChange}
          value={id}
          suffixIcon={<span className="mzc-arrow" />}
        >
          {urlList.map((item) => {
            return (
              <Select.Option value={item.id} key={item.id}>
                {item.name}
              </Select.Option>
            );
          })}
        </Select>
      </div>
      <Vlc src={src} width={width} height={height} />
    </div>
  );
}

import React from "react";
import Vlc from "./vlc";

export default function () {
  return (
    <>
      <Vlc
        width={800}
        height={600}
        src="rtsp://aaaaa:123456aa@10.20.5.52/cam/playback?channel=1&subtype=0&starttime=2021_08_07_09_00_00&endtime=2021_08_08_15_00_00"
      />
    </>
  );
}

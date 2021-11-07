/*
 * @Author: JC.Liu
 * @Date: 2019-05-10 15:56:11
 * @Last Modified by: JC.Liu
 * @Last Modified time: 2019-05-12 10:25:49
 * vlc 播放器  用于录播 直播一定是RTMP
 */

import React, { Component } from "react";

export default class Vlc_video extends Component {
  componentDidMount() {
    // this.init_vlc("rtsp://aaaaa:123456aa@10.20.5.52:554/cam/playback?channel=1&subtype=0&starttime=2020_08_11_00_00_00&endtime=2020_08_11_01_00_00");


    console.log(this.getVLC)

  }

  init_vlc(url) {
    var vlc = this.getVLC("vlc");
    //注册对应的播放和暂停事件
    this.registerVLCEvent(
      "MediaPlayerPlaying",
      window.handle_MediaPlayerPlaying
    );
    this.registerVLCEvent("MediaPlayerPaused", window.handle_MediaPlayerPaused);
    //初始化精度条
    this.init_progresss(url);
    if (vlc) {
      vlc.playlist.items.clear();
      var options = [":rtsp-tcp"];
      var itemId = vlc.playlist.add(url, "", options);
      if (itemId != -1) {
        vlc.playlist.playItem(itemId);
      } else {
        alert("cannot play at the moment !");
      }
    }
  }

  render() {
    return (
      <div>
        Vlc_video
        <div id="vlc_video">
          <object
            classid="clsid:9BE31822-FDAD-461B-AD51-BE1D1C159921"
            width="100%"
            height="634"
            id="vlc"
          >
            <param name="MRL" value="" />
            <param name="ShowDisplay" value="true" />
            <param name="AutoLoop" value="False" />
            <param name="AutoPlay" value="False" />
            <param name="Volume" value="50" />
            <param name="Toolbar" value="false" />
            <param name="StartTime" value="0" />
            <embed
              pluginspage="http://www.videolan.org"
              type="application/x-vlc-plugin"
              width="100%"
              height="630"
              toolbar="false"
              loop="false"
              branding="true"
              text="Waiting for video"
              bgcolor="#000000"
              allowfullscreen="true"
              name="vlc"
            />
          </object>
        </div>
      </div>
    );
  }
}

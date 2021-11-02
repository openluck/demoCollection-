<template>
    <div class="videocall">
      <div class="video video-grid" v-if="isStart">
        <!-- 本地流 -->
        <div
            id="local_stream"
            class="local_stream"
            :class=" tagge ? 'small' : 'big' "
            @click="taggeLocal"
        ></div>
        <!-- 远端流 -->
        <div
            id="remote_stream"
            class="remote_stream"
            :class=" tagge ? 'big' : 'small' "
            @click="taggeRemote"
        ></div>
        </div>
        <div class="spin" v-else>
            <a-spin tip="正在连接中..."></a-spin>
        </div>
        <div class="v-footer">
            <div v-if="isShowTime" class="time" ref="time" id="time">00:00:00</div>
            <a-button @click="leaveRoom" type="primary" size="small" icon="poweroff">挂断</a-button>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import { Message, Button, Spin } from "ant-design-vue";

import TRTC from "trtc-js-sdk"; //TRTC -SDK
import { genTestUserSig } from "./js/GenerateTestUserSig"; //计算usersing
import { mapState } from "vuex";

Vue.use(Button).use(Spin);
Vue.prototype.$message = Message;

export default {
    name: "videoCall",
    props: ["taskId"],
    data() {
        return {
            visible: false,
            userId: null, //用户id --可更改 userId可以为每个押运人的人员id，根据每个押运人的id来生成一个uersing用户签名
            roomId: null, //房间号--加入相同房间才能聊
            client_: "", //客户端服务
            remoteStream: "", //远方播放流
            localStream: "", //本地流
            sdkAppId: null,
            userSig: null,
            isJoined_: false,
            isPublished_: false,
            localStream_: null,
            remoteStreams_: [],
            tagge: true, // 本地视频是否是主屏幕显示
            taggeT: false, // 远端视频是否是主屏幕显示
            isShowTime: false //接通之后显示时间
        };
    },
    computed: {
      ...mapState({
          isStart: state => state.videoCall.isStart
      })
    },
    watch: {
      isStart(val) {
        if(val) {
          //加入房间
          this.joinRoom();
        }
      }
    },
    mounted() {
        this.userId = this.taskId;
        //taskId 去掉小点，去掉字母
        this.roomId = Number(this.taskId.replace(/\./g, "").replace(/[a-zA-Z]+/g, "").slice(0, 9));
        console.warn("当前房间号是" + this.roomId);
        console.warn("当前用户ID是" + this.userId);
        TRTC.checkSystemRequirements().then(result => {
            // 判断浏览器是否支持TRTC
            if (!result) {
                alert("您的浏览器不支持TRTC! 请使用谷歌Chrome M72+，体验更佳");
            }
        });
        const { userId } = this; //一点击视频按钮就开始计算
        const userSingInfo = genTestUserSig(userId); //根据id生成usersing
        const { sdkAppId, userSig } = userSingInfo;
        this.sdkAppId = sdkAppId;
        this.userSig = userSig;
        //计算完成之后再加入房间
    },
    destroyed() {
      // //离开房间
      this.leaveRoom();
      clearTimeout(this.timer);
    },
    methods: {
        // 获取摄像头
        getCameras() {
            let cameras = null;
            TRTC.getCameras().then(devices => {
                cameras = devices;
                devices.forEach(dev => {
                    console.log(
                        "camera label: " +
                            dev.label +
                            " deviceId: " +
                            dev.deviceId
                    );
                });
            });
        },
        //切换摄像头
        switchCameras() {
            // 假设本地流 localStream 已经被发布
            // 切换到第二个摄像头
            let cameraId = cameras[1].deviceId;
            localStream.switchDevice("video", cameraId).then(() => {
                console.log("switch camera success");
            });
        },
        //本地点击变大
        taggeLocal() {
            this.tagge = !this.tagge;
        },
        //远端点击变大
        taggeRemote() {
            this.tagge = !this.tagge;
        },
        //加入房间
        joinRoom() {
            if (this.client_) return;
            this.join();
        },
        //开始推流
        onPublish() {
            if (!this.client_) {
                this.$message.error("请先加入房间！");
                return;
            }
            this.publish();
        },
        //停止推流
        onUnpublish() {
            if (!this.client_) {
                // this.$message.error('请先加入房间！')
                return;
            }
            this.unpublish();
        },
        //离开房间
        leaveRoom() {
            this.leave();
            this.$parent.showVideoCall = false;
        },
        //加入房间
        async join() {
            if (this.isJoined_) {
                console.warn("duplicate RtcClient.join() observed");
                return;
            }
            // 创建实例
            this.client_ = TRTC.createClient({
                mode: "videoCall", // 实时通话模式
                sdkAppId: this.sdkAppId,
                roomId: this.roomId,
                userId: this.userId,
                userSig: this.userSig
            });
            // 处理 client 事件
            this.handleEvents();

            try {
                // 加入这个roomid的房间
                await this.client_.join({ roomId: this.roomId });
                console.log("进房成功！");
                this.$message.success("进房成功！");
                this.isJoined_ = true;
            } catch (error) {
                console.error("进房失败,因为: " + error);
                alert(
                    "进房失败原因：" +
                        error +
                        "\r\n\r\n请确保您的网络连接是正常的" +
                        "\r\n\r\n另外，请确保您的账号信息是正确的。" +
                        "\r\n请打开链接：https://cloud.tencent.com/document/product/647/34342 查询详细错误信息！"
                );
                this.$message.error("进房错误！");
                return;
            }

            try {
                // 采集摄像头和麦克风视频流
                await this.createLocalStream({ audio: true, video: true });
                this.$message.success("摄像头及麦克风采集成功！");
                console.log("摄像头及麦克风采集成功！");
            } catch (error) {
                console.error("摄像头及麦克风采集失败！: " + error);
                //  如果您没有连接摄像头或麦克风，您可以通过调整第60行代码来关闭未连接设备的采集请求！
                this.$message.error(
                    "请确认设备已连接摄像头和麦克风并授予其访问权限！否则对方将看不到您的画面。"
                );
                // try {
                //     // 仅用于捕获相机
                //     await this.createLocalStream({ audio: false, video: true });
                //     this.$message.success('仅采集摄像头成功！')
                // }
                // catch (error) {
                //     console.error('采集摄像头失败！: ' + error);
                //     return;
                // }
                // try {
                //     // 仅用于捕获麦克风
                //     await this.createLocalStream({ audio: true, video: false });
                //     this.$message.success('采集麦克风成功！')
                // }
                // catch (error) {
                //     console.error('采集麦克风失败！: ' + error);
                //     return;
                // }
            }

            // this.localStream_.on("player-state-changed", event => {
            //     console.log(
            //         `local stream ${event.type} player is ${event.state}`
            //     );
            //     if (event.type === "video" && event.state === "PLAYING") {
            //         // dismiss the remote user UI placeholder
            //     } else if (
            //         event.type === "video" &&
            //         event.state === "STOPPPED"
            //     ) {
            //         // show the remote user UI placeholder
            //     }
            // });

            // 在名为 ‘local_stream’ 的 div 容器上播放本地音视频
            this.localStream_.play("local_stream");

            // 在加入房间后，默认发布本地流
            await this.publish();
            this.$message.success("发布本地流成功！");
        },
        //离开房间
        async leave() {
            if (!this.isJoined_) {
                console.warn("leave() - leave without join()d observed");
                this.$message.error("请先加入房间！");
                return;
            }

            if (this.isPublished_) {
                // 确保在离开之前本地流已被取消发布。
                await this.unpublish(true);
            }

            try {
                // 离开房间
                await this.client_.leave();
                this.$message.warning("你已退出房间！");
                this.isJoined_ = false;
            } catch (error) {
                console.error("退出房间失败，因为: " + error);
                location.reload();
                /********************************************************************************** */
            } finally {
                // 停止本地流，关闭本地流内部的音视频播放器
                this.localStream_.stop();
                // 关闭本地流，释放摄像头和麦克风访问权限
                this.localStream_.close();
                this.localStream_ = null;
                this.client_ = null;
                // console.log(this.client_); //null
            }
        },

        //发布本地流
        async publish() {
            //如果接口返回的是true 就开始推流。反之亦然
            if (!this.isJoined_) {
                this.$message.error("请先加入房间再点击开始推流！");
                // console.warn('publish() - please join() firstly');
                return;
            }
            if (this.isPublished_) {
                // console.warn('duplicate RtcClient.publish() observed');
                this.$message.error("当前正在推流！");
                return;
            }
            try {
                // 发布本地流
                await this.client_.publish(this.localStream_);
                this.$message.success("发布本地流成功！");
                this.isPublished_ = true;
            } catch (error) {
                // console.error('failed to publish local stream ' + error);
                this.$message.error("发布本地流失败！");
                this.isPublished_ = false;
            }
        },
        //停止推流
        async unpublish(isLeaving) {
            if (!this.isJoined_) {
                console.warn("unpublish() - please join() firstly");
                this.$message.error("请先加入房间再停止推流！");
                return;
            }
            if (!this.isPublished_) {
                console.warn(
                    "RtcClient.unpublish() called but not published yet"
                );
                this.$message.error("当前尚未发布本地流！");
                return;
            }

            try {
                // 停止发布本地流
                await this.client_.unpublish(this.localStream_);
                this.isPublished_ = false;
                this.$message.success("停止发布本地流成功！");
            } catch (error) {
                console.error(
                    "failed to unpublish local stream because " + error
                );
                this.$message.error("停止发布本地流失败！");
                if (!isLeaving) {
                    console.warn(
                        "leaving the room because unpublish failure observed"
                    );
                    this.$message.error("停止发布本地流失败，退出房间！");
                    this.leave();
                }
            }
        },
        //采集设备
        async createLocalStream(options) {
            this.localStream_ = TRTC.createStream({
                audio: options.audio, // 采集麦克风
                video: options.video, // 采集摄像头
                userId: this.userId
                // cameraId: getCameraId(),
                // microphoneId: getMicrophoneId()
            });
            // 设置视频分辨率帧率和码率
            this.localStream_.setVideoProfile("1080p");

            await this.localStream_.initialize();
        },
        //事件处理
        handleEvents() {
            // 处理 client 错误事件，错误均为不可恢复错误，建议提示用户后刷新页面
            this.client_.on("error", err => {
                console.error(err);
                this.$message.error("客户端错误，请刷新页面！" + err);
                location.reload();
            });

            // 处理用户被踢事件，通常是因为房间内有同名用户引起，这种问题一般是应用层逻辑错误引起的
            // 应用层请尽量使用不同用户ID进房
            this.client_.on("client-banned", err => {
                console.error("用户被踢出房间！房间内有同名用户。 " + err);
                this.$message.error("用户被踢出房间！房间内有同名用户。");
                location.reload();
            });

            // 远端用户进房通知 - 仅限主动推流用户
            this.client_.on("peer-join", evt => {
                const userId = evt.userId;
                console.log("远端用户进房" + userId);
                this.$message.warning("远端用户进房 - " + userId);
            });
            // 远端用户退房通知 - 仅限主动推流用户
            this.client_.on("peer-leave", evt => {
                clearTimeout(this.timer);
                const userId = evt.userId;
                console.log("远端用户退房" + userId);
                this.$message.warning("远端用户退房 - " + userId);
            });

            // 处理远端流增加事件
            this.client_.on("stream-added", evt => {
                const remoteStream = evt.stream;
                const id = remoteStream.getId();
                const userId = remoteStream.getUserId();
                console.log(
                    `remote stream added: [${userId}] ID: ${id} type: ${remoteStream.getType()}`
                );
                this.$message.warning("远端流增加 - " + userId);
                // console.log('subscribe to this remote stream');
                // 远端流默认已订阅所有音视频，此处可指定只订阅音频或者音视频，不能仅订阅视频。
                // 如果不想观看该路远端流，可调用 this.client_.unsubscribe(remoteStream) 取消订阅
                this.client_
                    .subscribe(remoteStream, { audio: true, video: true })
                    .catch(e => {
                        console.error("订阅远端流失败！");
                        this.$message.error("订阅远端流失败！")
                    });
            });

            // 远端流订阅成功事件
            this.client_.on("stream-subscribed", evt => {
                //订阅成功后开始计时
                this.calcTime();
                const remoteStream = evt.stream;
                const id = remoteStream.getId();
                this.remoteStreams_.push(remoteStream);
                // addView(id);
                // 在指定的 div 容器上播放音视频
                remoteStream.play("remote_stream", id);
                console.log("stream-subscribed ID: ", id);
                this.$message.warning(
                    "远端流订阅成功 - " + remoteStream.getUserId()
                );
            });

            // 在某些版本浏览器上移动传入 play() 的 div 容器可能会导致音视频播放器进入 ‘PAUSED’ 状态，此时 需要调用该接口恢复播放。
            // 由于浏览器自动播放策略的限制，在 play() 返回 PLAY_NOT_ALLOWED 错误后需要引导用户通过手势 调用该接口恢复播放。
            this.client_.on("player-state-changed", event => {
                if (event.state === "PAUSED") {
                    // resume audio/video playback
                    this.client_.resume();
                }
            });

            // 处理远端流被删除事件
            this.client_.on("stream-removed", evt => {
                const remoteStream = evt.stream;
                const id = remoteStream.getId();
                // 关闭远端流内部的音视频播放器
                remoteStream.stop();
                clearTimeout(this.timer);
                this.remoteStreams_ = this.remoteStreams_.filter(stream => {
                    return stream.getId() !== id;
                });
                // removeView(id);
                console.log(
                    `stream-removed ID: ${id}  type: ${remoteStream.getType()}`
                );
                // Toast.info('远端流删除 - ' + remoteStream.getUserId());
                this.$message.warning(
                    "远端流退房 - " + remoteStream.getUserId()
                );
            });

            // 处理远端流更新事件，在音视频通话过程中，远端流音频或视频可能会有更新
            this.client_.on("stream-updated", evt => {
                const remoteStream = evt.stream;
                console.log(
                    "type: " +
                        remoteStream.getType() +
                        " stream-updated hasAudio: " +
                        remoteStream.hasAudio() +
                        " hasVideo: " +
                        remoteStream.hasVideo()
                );
                // Toast.info('远端流更新！');
                this.$message.success("远端流更新成功！");
            });

            // 远端流音频或视频mute状态通知
            this.client_.on("mute-audio", evt => {
                // console.log(evt.userId + " mute audio");
                console.log(evt.userId + "用户已静音");
                
            });
            this.client_.on("unmute-audio", evt => {
                console.log(evt.userId + " unmute audio");
                console.log(evt.userId + "用户已解除静音");
            });
            this.client_.on("mute-video", evt => {
                console.log(evt.userId + " mute video");
            });
            this.client_.on("unmute-video", evt => {
                console.log(evt.userId + " unmute video");
            });

            // 信令通道连接状态通知
            this.client_.on("connection-state-changed", evt => {
                console.log(
                    `RtcClient state changed to ${evt.state} from ${evt.prevState}`
                );
            });
        },
        //增加view
        addView(id) {},
        //删除view
        removeView(id) {},
        //计时开始
        calcTime() {
            this.isShowTime = true;
            let sec = 0;
            this.timer = setInterval(() => {
                sec++;
                let date = new Date(0, 0);
                date.setSeconds(sec);
                let h = date.getHours(),
                    m = date.getMinutes(),
                    s = date.getSeconds();
                document.getElementById("time").innerText =
                    this.twoChar(h) +
                    ":" +
                    this.twoChar(m) +
                    ":" +
                    this.twoChar(s);
            }, 1000);
        },
        twoChar(n) {
            return n >= 10 ? n : "0" + n;
        }
    }
};
</script>
<style scoped>
.videocall {
    width: calc(100% - 1px);
    height: 306px;
}
.video-grid {
    width: calc(100% - 1px);
    height: calc(100% - 20px);
    position: relative;
    overflow: hidden;
}

.big {
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;
    /* background: url(~@/assets/videobg.png) no-repeat center center; */
    background: lightgray;
    background-size: cover;
}
.small {
    width: 40%;
    height: 40%;
    position: absolute;
    top: 0;
    right: 0;
    border: 1px solid #808080;
    z-index: 999;
    /* background: url(~@/assets/videobg.png) no-repeat center center; */
    background: lightblue;
    background-size: cover;
}
.spin {
    width: calc(100% - 1px);
    height: 280px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.v-footer{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 5px;
    height: 26px;
}
.time {
    margin-right: 20px;
    font-size: 12px;
    color: blueviolet;
}
</style>
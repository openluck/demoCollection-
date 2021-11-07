import { Component, Prop, Watch, Mixins } from 'vue-property-decorator';
import sdkHelper from '@/helpers/SDKHelper';
import PlayVideoMixin from '@/mixins/PlayVideoMixin';

declare const Txplayer: Txplayer;

let player: any;

@Component
export default class PlayVideoBox extends Mixins(PlayVideoMixin) {
  @Prop({ required: true }) vid!: string;
  @Prop({ required: true }) title!: string;
  @Prop({ required: true }) poster!: string;
  @Prop({ required: true }) onHide!: () => void;

  public mounted() {
    if (!this.vid) {
      this.$toast('无法获取到视频 ID');
      return;
    }
    this.bindEvent();
    this.createVideo();
  }

  @Watch('vid')
  public update() {
    this.createVideo();
  }

  public handleClosePlayBox() {
    if (sdkHelper.isSupportVideoPlayer()) {
      sdkHelper.hideVideoPlayer();
    } else {
      player?.pause();
    }
    this.$nextTick(() => {
      this.onHide();
    });
  }

  public destroyed() {
    if (sdkHelper.isSupportVideoPlayer()) {
      sdkHelper.hideVideoPlayer();
      sdkHelper.destroyTPlayer();
    } else {
      player = null;
    }
  }

  protected getVideoId() {
    return this.vid;
  }
}

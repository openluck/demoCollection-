/**
 * note: 抽离 播放视频的逻辑组件
 */
import sdkHelper, { SDKCustomPlayArgs } from '@/helpers/SDKHelper';
import { loadScript, reportV4Read } from '@/services/commons';
import { Component } from 'vue-property-decorator';
import BaseMixin from './BaseMixin';

declare const Txplayer: Txplayer;

@Component
export default class PlayVideoMixin extends BaseMixin {
  public loading = true;

  // 子类重写
  protected getTitle() {
    return '';
  }

  protected getVideoId() {
    return '';
  }

  // 子类重写
  protected getVideoPoster() {
    return '';
  }

  protected bindEvent() {
    window.addEventListener('resize', () => {
      if (sdkHelper.isSupportVideoPlayer()) {
        const el = document.querySelector('#my-video');
        if (el) {
          const offset = el.getBoundingClientRect();
          sdkHelper.resizeCustomPlayer(offset.left, offset.top, offset.width, offset.height);
        }
      }
    });
  }

  protected createVideo() {
    const el = document.querySelector('#my-video') as HTMLElement;
    if (el) {
      this.doCreate(el);
    } else {
      setTimeout(() => {
        this.doCreate(el);
      }, 10);
    }
  }

  protected doCreate(el: HTMLElement) {
    const offset = el.getBoundingClientRect();
    if (sdkHelper.isSupportVideoPlayer()) {
      const config: SDKCustomPlayArgs = {
        height: offset.height,
        left: offset.left,
        title: this.getTitle(),
        vid: this.getVideoId(),
        top: offset.top,
        width: offset.width,
      };
      const ret = sdkHelper.customPlay(config);
      if (!ret) {
        this.createH5Player();
        return;
      }
      this.loading = false;
      reportV4Read(this.getVideoId(), '1');
    } else {
      this.createH5Player();
    }
  }

  protected getVideoConfig() {
    return {
      containerId: 'my-video',
      vid: this.getVideoId(),
      width: '100%',
      height: '100%',
      enForcePlayerType: true,
      playerType: 'html5hd',
      poster: this.getVideoPoster(),
    };
  }

  protected createH5Player() {
    this.loadVideoSdk();
  }

  protected initPlayer() {
    const config = this.getVideoConfig() as any;
    reportV4Read(this.getVideoId(), '1');
    new Txplayer(config);
    this.setVideoPoster();
    this.$nextTick(() => {
      this.loading = false;
    });
  }

  protected setVideoPoster() {
    const videoEl = document.querySelector('.txp_video_container video') as HTMLVideoElement;
    if (videoEl) {
      videoEl.setAttribute('poster', this.getVideoPoster());
    } else {
      setTimeout(() => {
        this.setVideoPoster();
      }, 10);
    }
  }

  protected async loadVideoSdk() {
    if (typeof Txplayer === 'undefined') {
      const ret = await loadScript('https://vm.gtimg.cn/tencentvideo/txp/js/txplayer.js');
      if (ret) {
        this.initPlayer();
      }
    } else {
      this.initPlayer();
    }
  }
}

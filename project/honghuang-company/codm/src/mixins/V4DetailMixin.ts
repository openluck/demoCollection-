/**
 * note: v4 数据 detail
 */
import { globalConfig } from '@/config';
import { sendIntegralEvent } from '@/services/found';
import { addV4ContentVote, cancelV4ContentVote, getTotalVote, reportV4Read } from '@/services/commons';
import { loadScript } from '@tencent/slug-function-vue';
import { Component } from 'vue-property-decorator';
import BaseMixin from './BaseMixin';

declare const SlugShare: SlugShareComp;

@Component
export default class V4DetailMixin extends BaseMixin {
  public detail: IV4DetailData | null = null;
  public totalVote = 0;

  public lockLike = false;

  public zIndex = 10;

  public operateInfo: {
    like: boolean;
    likeCount: number;
    tread: boolean;
    treadCount: number;
  } = {
    like: false,
    tread: false,
    likeCount: 0,
    treadCount: 0,
  };

  protected share!: SlugShareComp;

  public replaceImgUrl(url: string) {
    return this.mImageView(url, '/1/w/91/h/52');
  }

  public async getData() {
    const id = this.$route.params.id;

    if (!id) {
      this.$toast('id 不能为空哦');
      return;
    }
    const data = await this.fetchDetail(parseInt(id, 10));
    if (!data) {
      // this.$toast('好像走丢了, 请稍后再试试');
      return;
    }
    this.detail = data;
    const { iTotalPlay } = data;
    this.detail.iTotalPlay = `${this.randomV4ContentPlayCount(parseInt(iTotalPlay, 10), parseInt(id, 10))}`;
  }

  protected async addVote(type: 1 | 2, worksType: 1 | 2) {
    const id = this.$route.params.id;
    if (!id) {
      return;
    }
    if (this.lockLike) {
      return;
    }
    this.lockLike = true;
    const ret = await addV4ContentVote(parseInt(id, 10), type, worksType);
    if (ret.code === 0 || ret.code === 200) {
      this.updateOperateInfo(type, 'add');
      this.lockLike = false;
      return;
    }
    this.$toast(`操作失败了呢?, 稍后再试试! 呜呜: ${ret.code}`);
    this.lockLike = false;
  }

  protected async cancelVote(type: 1 | 2, worksType: 1 | 2) {
    const id = this.$route.params.id;
    if (!id) {
      return;
    }
    if (this.lockLike) {
      return;
    }
    this.lockLike = true;
    const ret = await cancelV4ContentVote(parseInt(id, 10), type, worksType);
    if (ret.code === 0 || ret.code === 200) {
      this.updateOperateInfo(type, 'cancel');
      this.lockLike = false;
      return;
    }
    this.$toast(`操作失败了呢?, 稍后再试试! 呜呜: ${ret.code}`);
    this.lockLike = false;
  }

  protected updateOperateInfo(type: 1 | 2, operate: 'add' | 'cancel') {
    let { likeCount, treadCount } = this.operateInfo;
    if (type === 1) {
      if (this.operateInfo.tread) {
        treadCount--;
      }
      this.operateInfo = {
        like: operate === 'add',
        tread: false,
        likeCount: operate === 'add' ? ++likeCount : --likeCount,
        treadCount,
      };
    } else {
      if (this.operateInfo.like) {
        likeCount--;
      }
      this.operateInfo = {
        like: false,
        tread: operate === 'add',
        likeCount,
        treadCount: operate === 'add' ? ++treadCount : --treadCount,
      };
    }
  }

  protected async getOperationData(type: 1 | 2) {
    const id = this.$route.params.id;
    if (!id) {
      return;
    }
    const ret = await getTotalVote(id, type);
    if (ret.code === 0 || ret.code === 200) {
      const d = ret.data;
      if (!d) {
        return;
      }
      this.setOperationInfo(d);
      return;
    }
    return null;
  }

  protected async fetchDetail(id: number): Promise<null | IV4DetailData> {
    console.log(id);
    return null;
  }

  protected report(type: '1' | '2') {
    const id = this.$route.params.id;
    if (!id) {
      return;
    }
    setTimeout(() => {
      reportV4Read(id, type);
    }, 100);
  }

  protected async initShare(type: 1 | 2) {
    if (typeof SlugShare === 'undefined') {
      await loadScript({
        url: 'https://tiem-cdn.qq.com/slugteam/components/share/v1/index.min.js',
      });
      if (!SlugShare) {
        await loadScript({
          url: 'https://tiem-cdn.qq.com/slugteam/components/share/v1/index.min.js',
        });
      }
    }
    if (typeof SlugShare !== 'undefined') {
      if (!this.detail) {
        return;
      }
      const config = this.getShareConfig(type);
      this.share = new SlugShare(config);
    }
  }

  protected getShareConfig(type: 1 | 2) {
    const id = (this.$route.params.id || '').trim();
    let url = `https://sy.qq.com/codm/static/article.html?id=${id}`;
    if (type === 1) {
      url = `https://sy.qq.com/codm/static/video.html?id=${id}`;
    }
    const { sTitle, sDesc } = this.detail as IV4DetailData;
    // note: todo:
    return {
      el: '#btn-share',
      actName: '#btn-share',
      title: sTitle, // 不设置或设置为空时，页面有title，则调取title
      desc: sDesc || sTitle, // 不设置或设置为空时，页面有Description，则调取Description
      imgUrl: globalConfig.defautShareImage,
      url,
      afterShare: this.afterShare,
    };
  }

  protected scorllToTop() {
    const wrapEl = document.querySelector('.content');
    if (wrapEl) {
      wrapEl.scrollTop = 0;
    }
  }

  private setOperationInfo(data: IThumbsData) {
    this.operateInfo.tread = data.thumbsType === 2;
    this.operateInfo.like = data.thumbsType === 1;
    this.operateInfo.likeCount = data.thumbsList.type1 || 0;
    this.operateInfo.treadCount = data.thumbsList.type2 || 0;
  }

  private afterShare(channel: any, status: boolean) {
    if (!this.share) {
      return;
    }
    const name = this.$route.name;
    if (status) {
      if (name === 'videoArticle') {
        // this.reportPageBtn('videos-selected-detail-share', '视频详情页分享按钮点击');
      } else {
        // this.reportPageBtn('selected-detail-share', '攻略详情页分享按钮点击');
      }
      console.log(`成功分享到：${channel}`);
      this.sendIntegralEvent('share');
    }
  }

  private async sendIntegralEvent(event: 'read' | 'share') {
    let type = 'article';
    const name = this.$route.name;
    if (name === 'videoArticle') {
      type = 'video';
    }
    await sendIntegralEvent(event, type);
  }
}

import { Component, Mixins, Watch } from 'vue-property-decorator';
import { getV4AritcleDetail } from '@/services/commons';
import { convertHttps, timeFormat } from '@vueUtils/filters';
import Loading from '@components/Loading';
import V4DetailMixin from '@mixins/V4DetailMixin';
import V4ListItem from '@components/V4ListItem';
import Comment from '@components/Comment';
import PlayVideoMixin from '@/mixins/PlayVideoMixin';

declare const Txplayer: Txplayer;

@Component({
  name: 'articleDetail',
  components: { Loading, V4ListItem, Comment },
  filters: { convertHttps, timeFormat },
})
export default class ArticleDetail extends Mixins(V4DetailMixin, PlayVideoMixin) {
  public detail: IV4DetailData | null = null;

  private videoId = '';
  public created() {
    this.report('2');
  }

  public async mounted() {
    await Promise.all([this.getData(), this.getOperationData(2)]);
    this.initShare(2);
  }

  @Watch('$route.params.id')
  public async updateData() {
    if (this.$route.name === 'articleDetail') {
      await Promise.all([this.getData(), this.getOperationData(2)]);
      this.scorllToTop();
    }
  }

  // 赞
  public handleClickLike() {
    if (this.operateInfo.like) {
      this.cancelVote(1, 2);
    } else {
      this.addVote(1, 2);
    }
  }

  // 踩
  public handleClickTread() {
    if (this.operateInfo.tread) {
      this.cancelVote(2, 2);
    } else {
      this.addVote(2, 2);
    }
  }

  // 正文内容
  public renderContent() {
    if (!this.detail) {
      return '';
    }
    let content = this.detail.sContent || '';
    content = content
      .replace(/<script.*script>/gi, '')
      .replace(/color: ?[^;"]*;?/gi, '')
      // eslint-disable-next-line @typescript-eslint/naming-convention
      .replace(
        /<img([^>]+)src="([^"]+)/g,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        (_, p1, p2) => `<img${p1}src="${p2} crossorigin='anonymous'`,
      );
    const div = document.createElement('div');
    div.innerHTML = content;
    this.handleExceptionVideo(div);
    const imgs = div.querySelectorAll('img');
    const imgList = Array.from(imgs);
    for (const img of imgList) {
      if (img.hasAttribute('width')) {
        img.removeAttribute('width');
      }
      if (img.hasAttribute('height')) {
        img.removeAttribute('height');
      }
    }
    return div.innerHTML;
  }

  protected async fetchDetail(id: number) {
    const ret = await getV4AritcleDetail(id);
    if (ret.code === 0) {
      return ret.data;
    }
    this.$toast('好像走丢了, 请稍后再试试');
    return null as any;
  }

  // 子类重写
  protected getTitle() {
    return this.detail?.sTitle || '';
  }

  protected getVideoId() {
    return this.videoId;
  }

  // 子类重写
  protected getVideoPoster() {
    return this.detail?.sIMG || '';
  }

  private handleExceptionVideo(div: HTMLDivElement) {
    const videoEls = div.querySelectorAll('video');
    if (videoEls.length === 0) {
      return;
    }
    for (const v of videoEls) {
      const parent = v.parentElement;
      if (parent) {
        parent.id = 'my-video';
        parent.classList.add('video-box');
        parent.style.width = '300px';
        parent.style.height = '145px';
        parent.style.margin = '0 auto';
        parent.style.display = 'block';
        const sourceEl = v.querySelector('source') as HTMLSourceElement;
        if (sourceEl) {
          const src = sourceEl.src || '';
          if (!src) {
            v.remove();
            continue;
          }
          if (src.startsWith('http')) {
            this.videoId = this.extraUrlVid(src);
          } else {
            this.videoId = src;
          }
          this.$nextTick(() => {
            this.createH5Player();
          });
        }
        v.remove();
      }
    }
  }

  private extraUrlVid(src: string) {
    const tail = src.split('/').pop() as string;
    if (tail) {
      const [vid, ext] = tail.split('.');
      if (ext === 'html') {
        return vid;
      }
      return '';
    }
    return '';
  }
}

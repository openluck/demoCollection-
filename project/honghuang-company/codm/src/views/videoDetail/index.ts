import { Component, Mixins, Watch } from 'vue-property-decorator';
import V4DetailMixin from '@mixins/V4DetailMixin';
import { getV4VideoDetail, loadScript } from '@/services/commons';
import V4ListItem from '@components/V4ListItem';
import { convertHttps, timeFormat } from '@vueUtils/filters';
import Loading from '@components/Loading';
import Comment from '@components/Comment';
import PlayVideoBox from '@components/PlayVideoBox';
// import slugSdk from '@/helpers/SlugSdk';

@Component({
  name: 'videoDetail',
  components: { Loading, V4ListItem, Comment, PlayVideoBox },
  filters: { convertHttps, timeFormat },
})
export default class VideoDetail extends Mixins(V4DetailMixin) {
  public detail: IV4DetailData | null = null;

  public showPlayBox = false;

  private isClickPlay = 0;

  public created() {
    this.loadTxpScript();
    this.report('1');
  }

  public async mounted() {
    await Promise.all([this.getData(), this.getOperationData(1)]);
    this.initShare(1);
  }

  @Watch('$route.params.id')
  public async updateData() {
    if (this.$route.name === 'videoDetail') {
      await Promise.all([this.getData(), this.getOperationData(1)]);
      this.scorllToTop();
    }
  }

  public handleShowPlayBox() {
    this.isClickPlay = 1;
    this.showPlayBox = true;
  }

  public destroyed() {
    if (this.isClickPlay === 0) {
      return;
    }
    // if (
    //   slugSdk.isSupportVideoPlayer()
    // ) {
    //   slugSdk.destroyTPlayer();
    // }
  }

  public handleClosePlayBox() {
    this.showPlayBox = false;
  }

  // 赞
  public handleClickLike() {
    if (this.operateInfo.like) {
      this.cancelVote(1, 1);
    } else {
      this.addVote(1, 1);
    }
  }

  // 踩
  public handleClickTread() {
    if (this.operateInfo.tread) {
      this.cancelVote(2, 1);
    } else {
      this.addVote(2, 1);
    }
  }

  protected async fetchDetail(id: number) {
    const ret = await getV4VideoDetail(id);
    if (ret.code === 0) {
      return ret.data;
    }
    this.$toast('好像走丢了, 请稍后再试试');
    return null;
  }

  private async loadTxpScript() {
    await loadScript('https://vm.gtimg.cn/tencentvideo/txp/js/txplayer.js');
  }
}

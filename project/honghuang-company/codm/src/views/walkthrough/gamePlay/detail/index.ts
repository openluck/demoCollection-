import { Component, Watch } from 'vue-property-decorator';
import V4VideoCardList from '@components/V4VideoCardList';
import Loading from '@components/Loading';
import PlayVideoBox from '@components/PlayVideoBox';
import BaseVue from '@helpers/BaseVue';
import zlkParser from '@/helpers/ZLKParser';
import { convertHttps } from '@/vueUtils/filters';

type TabType = 'mode' | 'map';

@Component({
  name: 'gamePlayDetail',
  components: {
    V4VideoCardList,
    Loading,
    PlayVideoBox,
  },
  filters: {
    convertHttps,
  },
})
export default class GamePlayDetail extends BaseVue {
  public detail: IGamePlayItemData | IMapGuideData | null = null;

  public tab: TabType = 'mode';

  public v4Id = '';

  public showPlayBox = false;

  public created() {
    this.init();
  }

  @Watch('$route.query.tab')
  public updatePage() {
    if (this.$route.name === 'gameplay-detail') {
      this.init();
    }
  }

  public handleShowPlayBox() {
    this.showPlayBox = true;
  }

  public handleClosePlayBox() {
    this.showPlayBox = false;
  }

  private init() {
    this.tab = this.$route.query.tab as TabType;
    this.setDetail();
  }

  private async setDetail() {
    const id = this.$route.params.id;

    if (!id) {
      this.$toast('未获取武器 id');
      return;
    }

    let data = null;
    if (this.tab === 'mode') {
      data = await zlkParser.getGamePlayDetailById(id);
      this.v4Id = data?.wfglv4id84 || '';
    } else {
      data = await zlkParser.getMapGuideDetailById(id);
      this.v4Id = data?.dtglv4id79 || '';
    }

    if (!data) {
      this.$toast('未获取武器详情, id 有误');
      return;
    }

    this.detail = data;
  }
}

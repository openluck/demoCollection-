import { Component, Mixins } from 'vue-property-decorator';
import { getLabelConfig } from '@/services/home';
import MossOperationMixin from '@/mixins/MossOperationMixin';
import OwnRouteLink from '@components/OwnRouteLink';

@Component({
  name: 'WalkthroughLabel',
  components: { OwnRouteLink },
})
export default class WalkthroughLabel extends Mixins(MossOperationMixin) {
  public labelList: ILabelItem[] = [];

  private cacheData: ILabelItem[] = [];

  private page = 0;
  private limit = 6;

  public labelCls(recommended: 'hot' | 'news' | '') {
    if (recommended === 'news') {
      return 'bd-li green';
    }
    if (recommended === 'hot') {
      return 'bd-li red';
    }
    return 'bd-li';
  }

  public created() {
    this.labelList = this.getOldData('homeLabel') || [];
    this.fetchData();
  }

  public handleUpdateLabels() {
    this.page++;
    const length = this.cacheData.length;
    if (this.page === Math.ceil(length / this.limit)) {
      this.page = 0;
    }
    this.labelList = this.getList();
  }

  private async fetchData() {
    const ret = await getLabelConfig();
    if (ret.code === 0) {
      const list = this.parserRawData<ILabelItem>(ret.data, 'homeLabel');
      this.cacheData = list.sort((a, b) => a.sort - b.sort);
      this.labelList = this.getList();
      // note: 缓存一页数据
      this.setOldData('homeLabel', this.labelList);
    }
  }

  private getList() {
    return this.cacheData.slice(this.getUpBoundary(), this.getDownBoundary());
  }

  private getDownBoundary() {
    return (this.page + 1) * this.limit;
  }

  private getUpBoundary() {
    return this.page * this.limit;
  }
}

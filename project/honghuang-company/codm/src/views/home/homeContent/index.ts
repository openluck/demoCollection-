import { Component, Mixins } from 'vue-property-decorator';
import QuickEntry from '../components/QuickEntry';
import WalkthroughLabel from '../components/WalkthroughLabel';
import Swiper from '@components/Swiper';
import V4ListItem from '@components/V4ListItem';
// import V4ContentListMixin from '@/mixins/V4ContentListMixin';
import ScrollLoadMixin, { IScrollLoadMixin } from '@mixins/ScrollLoadMixin';
import { getV4DataList } from '@/services/commons';
import { V4_CONTENT_LIST_LIMIT } from '@/config';
import { createV4ListData } from '@/placeholderData';

@Component({
  name: 'homeContent',
  components: {
    Swiper,
    QuickEntry,
    WalkthroughLabel,
    V4ListItem,
  },
})
export default class HomeContentPage extends Mixins(ScrollLoadMixin) implements IScrollLoadMixin<IV4ListItemData> {
  public list: IV4ListItemData[] = createV4ListData(3, 4) as any;
  public v4id = 112111;

  public created() {
    (window as any).pageFirstMeaningfulPaint = performance.now();
    this.initData();
  }

  public mounted() {
    this.reportPagePerformanceMonitoring();
  }

  public getLimit() {
    return V4_CONTENT_LIST_LIMIT;
  }

  public getV4Id() {
    return this.v4id;
  }

  public async getList() {
    try {
      const {
        code,
        data: { items, total },
      } = await this.fetchStrategyList(this.getV4Id() as number);
      const list = this.parserV4ContentItem(items || []);
      if (code === 0) {
        if (this.list.length + list.length === total || list.length < this.getLimit() || total === 0) {
          this.noMoreData = true;
        } else {
          this.noMoreData = false;
        }
        return list as IV4ListItemData[];
      }
      return [];
    } catch (error) {
      console.log(error);
      this.noMoreData = false;
      this.lockScroll = false;
      return [];
    }
  }

  private async fetchStrategyList(id: number) {
    return await getV4DataList({
      limit: this.getLimit(),
      start: this.start,
      tagids: id,
      logic: 'and',
    });
  }
}

import { Component, Mixins, Prop } from 'vue-property-decorator';
import V4ListItem from '@components/V4ListItem';
import { timeFormat } from '@vueUtils/filters';
import ScrollLoadMixin, { IScrollLoadMixin } from '@mixins/ScrollLoadMixin';
import { getV4DataList } from '@/services/commons';
import { V4_CONTENT_LIST_LIMIT } from '@/config';
import { createV4ListData, createMossConfigData } from '@/placeholderData';

export type IMossConfigData = {
  img: string;
  id: number;
  title: string;
  url: string;
};

@Component({
  components: { V4ListItem },
  filters: { timeFormat },
})
export default class GuideImgVideoPanel extends Mixins(ScrollLoadMixin) implements IScrollLoadMixin<IV4ListItemData> {
  @Prop() showNextPageBtn!: boolean;
  @Prop() panelTitle!: string;
  @Prop() v4id!: number;
  @Prop({ default: 'warArea' })
  type!: 'firearms-hot' | 'firearms-gun' | 'warArea';
  @Prop({ default: () => createMossConfigData(2, 0) }) videoList!: IMossConfigData[];
  // banner
  @Prop() reportId2!: string;
  // 列表
  @Prop() reportId3!: string;

  public list: IV4ListItemData[] = createV4ListData(3, 4) as any;

  public created() {
    this.initData();
  }

  public getV4Id() {
    return this.v4id;
  }

  public getLimit() {
    return V4_CONTENT_LIST_LIMIT;
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

import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import V4CardItem from '@components/V4CardItem';
import Empty from '@components/Empty';
import { getV4DataList } from '@/services/commons';
import { timeFormat, convertHttps } from '@vueUtils/filters';
import ScrollLoadMixin, { IScrollLoadMixin } from '@/mixins/ScrollLoadMixin';

@Component({
  components: { V4CardItem, Empty },
  filters: { timeFormat },
})
export default class V4CardList extends Mixins(ScrollLoadMixin)
  implements IScrollLoadMixin<IBaseV4ContenteListItemData> {
  public list: IBaseV4ContenteListItemData[] = [];

  @Prop({ required: true, default: '' })
  public v4Id!: number;

  @Prop({ default: 6 })
  public initLimit!: number;

  @Prop({ default: 'or' })
  public v4Logic!: 'and' | 'or';

  @Prop({ default: '' })
  public reportId!: string[] | string;

  public created() {
    this.initData();
  }

  @Watch('v4Id')
  public updateList() {
    this.list = [];
    this.initData();
  }

  public getV4Id() {
    return this.v4Id;
  }

  public chooseCover(item: IBaseV4ContenteListItemData, size = '160*90') {
    if (item.sCoverList.length > 0) {
      for (const s of item.sCoverList) {
        if (s.size === size) {
          return convertHttps(s.url);
        }
      }
    }
    return item.sIMG;
  }

  public async getList() {
    try {
      const {
        code,
        data: { items, total },
      } = await this.fetchStrategyList(this.v4Id);
      const list = this.parserV4ContentItem(items || []);
      if (code === 0) {
        if (this.list.length + list.length === total || list.length < this.limit || total === 0) {
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
      limit: this.limit,
      start: this.start,
      tagids: id,
      logic: this.v4Logic,
    });
  }
}

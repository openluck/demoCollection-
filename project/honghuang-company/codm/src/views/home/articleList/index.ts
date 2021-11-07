import { Component, Mixins } from 'vue-property-decorator';
import ScrollLoadMixin, { IScrollLoadMixin } from '@/mixins/ScrollLoadMixin';
import { getV4DataList } from '@/services/commons';
import { homeStore } from '@store/modules/home';
import V4ListItem from '@components/V4ListItem';

@Component({
  name: 'articleList',
  components: { V4ListItem },
})
export default class ArticleListPage extends Mixins(ScrollLoadMixin) implements IScrollLoadMixin<IV4ListItemData> {
  public list: IV4ListItemData[] = [];

  public created() {
    this.setNavTitle();
    this.initData();
  }

  public getV4Id() {
    const id = this.$route.params.id;
    if (!id) {
      this.$toast('缺少 v4 内容id');
      return 0;
    }
    return parseInt(id, 10);
  }

  public destroyed() {
    homeStore.setTitle('使命召唤微社区');
  }

  public async getList() {
    try {
      const {
        code,
        data: { items, total },
      } = await this.fetchStrategyList(this.getV4Id() as number);
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

  private setNavTitle() {
    const { title } = this.$route.query;
    homeStore.setTitle(decodeURIComponent(title as string));
  }

  private async fetchStrategyList(id: number) {
    return await getV4DataList({
      limit: this.limit,
      start: this.start,
      tagids: id,
      logic: 'and',
    });
  }
}

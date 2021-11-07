/**
 * note:抽离通过 moss 广告位配置的排期运营数据, 对数据的有效期和数据解析
 * 如: 首页 banner, 快捷入口, 大神宝典
 */
import { Component } from 'vue-property-decorator';
import BaseMixin from './BaseMixin';
import { getV4DataList } from '@/services/commons';
import { convertHttps } from '@vueUtils/filters';

@Component
export default class V4ContentListMixin extends BaseMixin {
  public v4id!: number;
  public v4ContentList: IBaseV4ContenteListItemData[] = [];
  public total = 0;

  protected page = 1;

  protected limit = 6;

  protected cacheFristPageData: IBaseV4ContenteListItemData[] = [];

  // 换一换
  public handleUpdateData() {
    if (this.total === this.limit) {
      return;
    }
    this.page++;
    if (this.page >= this.getMaxPage()) {
      this.page = 1;
    }
    this.fetchList();
  }

  public chooseCover(item: IBaseV4ContenteListItemData, size = '160*90') {
    if (!item) {
      return '';
    }
    if (item.sCoverList && item.sCoverList.length > 0) {
      for (const s of item.sCoverList) {
        if (s.size === size) {
          return convertHttps(s.url);
        }
      }
    }
    return item.sIMG;
  }

  protected getV4Id() {
    return this.v4id;
  }

  protected async fetchList() {
    const ret = await getV4DataList({
      limit: this.limit,
      start: this.getStart(),
      tagids: this.getV4Id(),
    });
    if (ret.code === 0) {
      this.v4ContentList = this.parserV4ContentItem(ret.data.items || []);
      if (this.page === 1) {
        this.cacheFristPageData = this.v4ContentList;
      }
      this.total = ret.data.total;
    } else {
      if (ret.code === -1 && ret.msg === 'no data') {
        this.page = 1;
        this.v4ContentList = this.cacheFristPageData;
      }
    }
  }

  protected resetV4ConentListPage() {
    this.page = 1;
  }

  protected initV4ContentList() {
    this.resetV4ConentListPage();
    this.resetV4ConetentList();
    this.fetchList();
  }

  protected resetV4ConetentList() {
    this.cacheFristPageData = [];
  }

  protected getStart() {
    return (this.page - 1) * this.limit;
  }

  protected getMaxPage() {
    return Math.ceil(this.total / this.limit) + 1;
  }
}

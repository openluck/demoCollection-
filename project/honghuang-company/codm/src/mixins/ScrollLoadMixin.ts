/**
 * note:抽离通过 moss 广告位配置的排期运营数据, 对数据的有效期和数据解析
 * 如: 首页 banner, 快捷入口, 大神宝典
 */
import { Component, Prop } from 'vue-property-decorator';
import BaseMixin from './BaseMixin';
import { convertHttps } from '@vueUtils/filters';

export interface IScrollLoadMixin<T> {
  list: T[];
  getV4Id(): number;
  getList(): Promise<T[]>;
}

@Component
export default class ScrollLoadMixin<T> extends BaseMixin {
  public list: T[] = [];
  public noMoreData = false;
  public noData = false;

  @Prop({ default: '/1/w/182/h/108' })
  public imgRule!: string;

  protected start = 0;
  protected limit = 10;
  protected lockScroll = false;
  protected limitTime = 30 * 1000;
  protected sendTime = 0;

  // note: 子类实现
  public getV4Id() {
    return 0;
  }

  // note: 子类实现
  public getList(): Promise<T[]> {
    return Promise.resolve([]);
  }

  public getLimit() {
    return this.limit;
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

  public async handleScrollLoadMore() {
    if (this.lockScroll) {
      return;
    }
    if (this.noMoreData) {
      return;
    }
    this.lockScroll = true;
    this.start += this.getLimit();
    const items = await this.getList();
    this.lockScroll = false;
    this.list.push(...items);
  }

  public replaceImgUrl(url: string) {
    return this.mImageView(url, this.imgRule || '/1/w/182/h/108');
  }

  public async handlerRefresh() {
    // 节流， 防止用户多次触发
    if (this.sendTime === 0) {
      await this.initData();
      this.sendTime = Date.now();
    } else if (Date.now() - this.sendTime > this.limitTime) {
      await this.initData();
      this.sendTime = Date.now();
    }
  }

  protected async initData() {
    if (!this.getV4Id()) {
      return;
    }
    this.start = 0;
    if (this.lockScroll) {
      return;
    }
    this.list = await this.getList();
    if (this.list.length === 0) {
      this.noData = true;
    } else {
      this.noData = false;
    }
  }
}

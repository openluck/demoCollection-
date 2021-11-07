import { Component, Prop } from 'vue-property-decorator';
import BaseVue from '@helpers/BaseVue';
import { getIntegralExchangeList, getIntegralRecordList } from '@/services/found';
import Empty from '@components/Empty';
import Loading from '@components/Loading';
import { convertDealTypeToText, timeFormat } from '@vueUtils/filters';

@Component({
  name: 'intergralRecordList',
  components: { Empty, Loading },
  filters: {
    convertDealTypeToText,
    timeFormat,
  },
})
export default class IntegralRecordList extends BaseVue {
  // note: 积分记录或者是兑换记录
  @Prop({ required: true }) type!: 'integralLog' | 'exchange';

  public recordList: (IIntegralLogItemData | IIntegralExchangeListItemData)[] = [];
  public noData = false;
  public hasMoreData = true;
  public loading = true;

  private pageSize = 10;
  private pageInfo = '';

  public created() {
    if (this.type === 'integralLog') {
      this.initIntegralRecordList();
    } else {
      this.initIntegralExchangeList();
    }
  }

  public async handleScrollLoadMore() {
    if (this.noData) {
      return;
    }
    if (this.loading) {
      return;
    }
    if (!this.hasMoreData) {
      return;
    }
    this.loading = true;
    let items = [];
    if (this.type === 'integralLog') {
      items = await this.getIntegralRecordList(this.pageInfo);
    } else {
      items = await this.getIntegralExchangeList(this.pageInfo);
    }
    this.recordList.push(...items);
    this.loading = false;
  }

  private async initIntegralRecordList() {
    const items = await this.getIntegralRecordList(this.pageInfo);
    if (items.length === 0) {
      this.noData = true;
      return;
    }
    this.recordList = items;
    this.loading = false;
  }

  private async initIntegralExchangeList() {
    const items = await this.getIntegralExchangeList(this.pageInfo);
    if (items.length === 0) {
      this.noData = true;
      return;
    }
    this.recordList = items;
    this.loading = false;
  }

  private async getIntegralRecordList(page?: string) {
    const { data, code } = await getIntegralRecordList(this.pageSize, page);
    if (code === 0) {
      const pageInfo = data.pageInfo;
      this.pageInfo = pageInfo;
      const items = data.items || [];
      if (pageInfo === '0' || items.length === 0) {
        this.hasMoreData = false;
      }
      return items;
    }
    return [];
  }

  private async getIntegralExchangeList(page?: string) {
    const { data } = await getIntegralExchangeList(this.pageSize, page);
    if (data) {
      const pageInfo = data.pageInfo;
      this.pageInfo = pageInfo;
      const items = data.items || [];
      if (pageInfo === '0' || items.length === 0) {
        this.hasMoreData = false;
      }
      return items;
    }
    return [];
  }
}

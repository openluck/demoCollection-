import { Component } from 'vue-property-decorator';
import Empty from '@components/Empty';
import BaseVue from '@helpers/BaseVue';
import Loading from '@components/Loading';
import { doExchangeGood, getGoodsList } from '@/services/found';
import { foundStore } from '@store/modules/found';

@Component({
  components: { Loading, Empty },
})
export default class WelfareGiftPage extends BaseVue {
  public tips = '';

  public isShowTipModal = false;

  public tipModalTitle = '';

  public giftList: IIntegralGoodsListItemData[] = [];

  public loading = true;

  public noMore = false;

  public currentGift: IIntegralGoodsListItemData | null = null;

  public showExchangeSuccDialog = false;

  public showTipsDialog = false;

  public showConfirmExchangeDialog = false;

  private pageSize = 10;
  private pageInfo = '';

  // 锁定兑换奖励
  private lock = false;
  private noData = false;

  public get userInfo() {
    return foundStore.integralUserInfo || { pointBalance: 0 };
  }

  public created() {
    this.setupData();
  }

  public handleExchangeBtnTap(id: number) {
    const good = this.getGoodByGoodId(id);
    if (good) {
      this.currentGift = good;
      this.showConfirmExchangeDialog = true;
    }
  }

  public handleJump() {
    this.$router.push('/found/myaward');
  }

  public async handleScrollLoadMore() {
    if (this.noData) {
      return;
    }
    if (this.loading) {
      return;
    }
    if (this.noMore) {
      return;
    }
    this.loading = true;
    const items = await this.getGoodsList();
    this.giftList.push(...items);
    this.loading = false;
  }

  public handleExchangeConfrimTap() {
    if (!this.currentGift) {
      return;
    }
    if (!this.userInfo) {
      return;
    }
    const { goodsId, price } = this.currentGift;
    const { pointBalance = 0 } = this.userInfo;
    if (pointBalance < price) {
      this.showTipsModal('余额不足');
      return;
    }
    if (this.lock) {
      return;
    }
    this.lock = true;
    this.doExchangeGood(goodsId);
  }

  public handleTapExchangeSuccDialogCloseBtn() {
    this.showExchangeSuccDialog = false;
  }

  public handleCloseExchangeConfrimDialog() {
    this.showConfirmExchangeDialog = false;
  }

  public handleTipsCloseBtn() {
    this.showTipsDialog = false;
  }

  // 兑换商品
  private async doExchangeGood(goodId: number) {
    const { code, msg } = await doExchangeGood(goodId);
    if (code === 0) {
      this.updateGoodsList(goodId);
      await this.updateUserPoint();
      this.showExchangeSuccDialog = true;
      this.showConfirmExchangeDialog = false;
      this.lock = false;
      return;
    }
    this.lock = false;
    this.$toast(msg);
  }

  private updateGoodsList(goodId: number) {
    for (let i = 0; i < this.giftList.length; i++) {
      const g = this.giftList[i];
      if (g.goodsId === goodId) {
        const p = g.userBuyCount + 1;
        if (p > g.userBuyLimit) {
          this.giftList[i].userBuyCount = g.userBuyLimit;
        } else {
          this.giftList[i].userBuyCount = p;
        }
        break;
      }
    }
  }

  private async updateUserPoint() {
    return foundStore.updateIntegralUserInfo();
  }

  private showTipsModal(msg: string) {
    this.showTipsDialog = true;
    this.tips = msg;
  }

  private getGoodByGoodId(goodId: number) {
    for (const good of this.giftList) {
      if (goodId === good.goodsId) {
        return good;
      }
    }
    return null;
  }

  private async setupData() {
    const items = await this.getGoodsList();
    if (items.length === 0) {
      this.noData = true;
      return;
    }
    this.giftList = items;
    this.loading = false;
  }

  private async getGoodsList() {
    const { code, data } = await getGoodsList(this.pageSize, this.pageInfo);
    if (data && code === 0) {
      this.pageInfo = data.pageInfo;
      const items = data.items || [];
      if (this.pageInfo === '0' || items.length === 0) {
        this.noMore = true;
      }
      return items.sort((a, b) => a.orderWeight - b.orderWeight);
    }
    return [];
  }
}

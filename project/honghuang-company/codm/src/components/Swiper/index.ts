import { Component, Mixins, Prop } from 'vue-property-decorator';
import { getSwiperAdList } from '@/services/home';
import MossOperationMixin from '@/mixins/MossOperationMixin';
import OwnRouteLink from '@components/OwnRouteLink';

@Component({
  components: { OwnRouteLink },
})
export default class Swiper extends Mixins(MossOperationMixin) {
  public swiperList: ISwiperItem[] = [];

  public title = '';

  public index = 1;

  @Prop({ default: 'homeBanner' })
  private cacheType!: 'homeBanner';

  public created() {
    this.swiperList = this.getOldData(this.cacheType as 'homeBanner') || [];
    if (this.swiperList.length > 0 && this.swiperList[0]) {
      this.title = this.swiperList[0].title;
    }
    this.fetchData();
  }

  public handleSwiperChange(index: number) {
    if (index > this.swiperList.length) {
      index = 0;
    }
    this.index = index + 1;
    this.title = this.swiperList[index].title;
  }

  private async fetchData() {
    const ret = await getSwiperAdList();
    if (ret.code === 0) {
      this.swiperList = this.parserRawData(ret.data, 'homeBanner');
      if (this.swiperList.length > 0) {
        this.title = this.swiperList[0].title;
        this.setOldData(this.cacheType, this.swiperList);
      }
    }
  }
}

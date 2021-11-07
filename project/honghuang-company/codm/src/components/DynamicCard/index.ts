import { Component, Mixins, Prop } from 'vue-property-decorator';
import { area, plat, convertHttps, timeFormat } from '@vueUtils/filters';
import DynamicLikeMixin from '@mixins/DynamicLikeMixin';
import { IDspDynamicInfoListItem } from '../DynamicWaterfall';
import { globalConfig } from '@/config';

// note: 点赞功能 mixin 实现
@Component({
  filters: {
    area,
    plat,
    convertHttps,
    timeFormat,
  },
})
export default class DynamicCard extends Mixins(DynamicLikeMixin) {
  @Prop() data!: IDspDynamicInfoListItem;
  @Prop() dynamicReportKey!: string;

  public defalutAvatar = globalConfig.defaultUserAvatarUrl;

  public get piclist() {
    return JSON.parse(this.data.piclist || '[]');
  }

  public get commentCount() {
    return this.data.igNum ? this.data.igNum.comment : 0;
  }

  public created() {
    this.likeInfo = {
      isLike: this.data.userOper,
      count: this.data.approvalNum,
    };
  }

  public previewIamge(url: string) {
    url = convertHttps(url);
    this.$swiperImage(this.getPreviewImageOptions(url));
  }

  public getCls() {
    const length = this.piclist.length;
    if (length === 2) {
      return 'dt-imgbox img2';
    }
    if (length === 3) {
      return 'dt-imgbox img3';
    }
    if (length >= 4) {
      return 'dt-imgbox img4';
    }
    return 'dt-imgbox';
  }

  private getPreviewImageOptions(url: string) {
    return {
      images: [{ url }],
      keyName: 'url',
    };
  }
}

import { Component, Prop } from 'vue-property-decorator';
import BaseVue from '@helpers/BaseVue';
import { IGuideItem } from '@/views/walkthrough/gamePlay';

@Component
export default class GuideCardItem extends BaseVue {
  @Prop() item!: IGuideItem;
  @Prop() tab!: string;
  @Prop() reportId!: string;
  // ['pattern.pattern', item.name]

  public handleJumpBtn(item: IGuideItem) {
    if (!item.name) {
      return;
    }
    if (item.url) {
      this.$router.push(item.url);
    } else {
      this.$router.push(`/walkthrough/gameplay_detail/${item.id}?tab=${this.tab}`);
    }
  }
}

import { Prop, Component } from 'vue-property-decorator';
import BaseVue, { BaseRef } from '@helpers/BaseVue';
import { IDspDynamicInfoListItem } from '../DynamicWaterfall';

interface Refs extends BaseRef {
  cardsBox: HTMLElement;
}

interface Events {
  reload: () => void
}

@Component({
  name: 'ownWaterfall',
})
class Waterfall extends BaseVue<Refs, Events> {
  @Prop({ default: [] })
  public list!: IDspDynamicInfoListItem[]; // 列表
}

export default Waterfall;

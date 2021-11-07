import { Component, Prop } from 'vue-property-decorator';
import BaseVue from '@helpers/BaseVue';
import { IGuideItem } from '@/views/walkthrough/gamePlay';
import GuideCardItem from '@components/GuideCardItem';

@Component({
  components: { GuideCardItem },
})
export default class GuideCardList extends BaseVue {
  @Prop() list!: IGuideItem[];
  @Prop({ default: 'mode' }) tab!: 'mode' | 'map' | 'skillCore';

  @Prop() reportId!: string;
}

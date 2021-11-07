import { Component, Prop } from 'vue-property-decorator';
import BaseVue from '@helpers/BaseVue';

@Component
export default class TopicItem extends BaseVue {
  @Prop()
  data!: IUgcTopicItem;

  @Prop({ default: false })
  active!: boolean;

  @Prop()
  private onClick!: (data: IUgcTopicItem) => void;

  @Prop()
  private deleteTopic!: (data: IUgcTopicItem) => void;

  public handleClick() {
    if (this.onClick) {
      this.onClick(this.data as IUgcTopicItem);
    }
  }

  public deleteTopicItem() {
    if (this.deleteTopic) {
      this.deleteTopic(this.data as IUgcTopicItem);
    }
  }
}

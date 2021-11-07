import { Prop, Component } from 'vue-property-decorator';
import { timeFormat, convertHttps } from '@vueUtils/filters';
import BaseVue from '@helpers/BaseVue';

@Component({
  filters: { timeFormat, convertHttps },
})
export default class V4ListItem extends BaseVue {
  @Prop({ required: true })
  public src!: string;

  @Prop({ required: true })
  public iId!: string;

  @Prop({ required: true })
  public sTitle!: string;

  @Prop({ required: true })
  public iTotalPlay!: string;

  @Prop({ required: true })
  public sIdxTime!: string;

  @Prop({ default: 'article' })
  public type!: 'article' | 'video';

  @Prop()
  public author!: string;

  @Prop()
  public reportId!: string | string[];

  public get link() {
    if (this.type === 'article') {
      return `/article_detail/${this.iId}`;
    }
    return `/video_detail/${this.iId}`;
  }
}

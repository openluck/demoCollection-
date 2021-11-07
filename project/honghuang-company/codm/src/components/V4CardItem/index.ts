import { Component, Prop } from 'vue-property-decorator';
import BaseVue from '@helpers/BaseVue';
import { convertHttps, timeFormat } from '@vueUtils/filters';

@Component({
  filters: { timeFormat, convertHttps },
})
export default class V4CardItem extends BaseVue {
  @Prop({ default: 'video' })
  public type!: 'video' | 'article';

  @Prop({ required: true })
  public src!: string;

  @Prop({ required: true })
  public iId!: string;

  @Prop({ required: true })
  public sTitle!: string;

  @Prop({ required: true })
  public sDesc!: string;

  @Prop({ required: true })
  public iTotalPlay!: string;

  @Prop({ required: true })
  public sIdxTime!: string;

  @Prop({})
  public reportId!: string[] | string;
}

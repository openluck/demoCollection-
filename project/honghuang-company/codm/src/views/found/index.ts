import { Component } from 'vue-property-decorator';
import BaseVue from '@helpers/BaseVue';
import { globalConfig } from '@/config';

@Component({
  name: 'found',
  components: {},
})
export default class FoundPage extends BaseVue {
  public get showPoint() {
    return globalConfig.mode !== 'production';
  }

  public get showCalendar() {
    return globalConfig.mode !== 'production';
  }

  public created() {
    this.resetWalkthroughTabTypeAction();
  }
}

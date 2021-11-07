import { Component } from 'vue-property-decorator';
import BaseVue from '@helpers/BaseVue';
import { homeStore } from '@store/modules/home';

@Component({
  name: 'home',
})
export default class HomePage extends BaseVue {
  public get title() {
    return homeStore.title;
  }

  public created() {
    this.resetWalkthroughTabTypeAction();
  }
}

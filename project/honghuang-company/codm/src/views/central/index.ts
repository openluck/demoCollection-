import { Component } from 'vue-property-decorator';
import BaseVue from '@helpers/BaseVue';
import { appStore } from '@store/modules/app';

@Component({
  name: 'central',
  components: {},
})
export default class CentralPage extends BaseVue {
  public get showTest() {
    return appStore.isShowTest;
  }

  public created() {
    this.resetWalkthroughTabTypeAction();
  }
}

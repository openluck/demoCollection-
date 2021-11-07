import HelloWorld from '@components/HelloWorld';
import { Component } from 'vue-property-decorator';
import BaseVue from '@helpers/BaseVue';

@Component({
  name: 'data',
  components: {
    HelloWorld,
  },
})
export default class DataPage extends BaseVue {
  public msg = 'data-page';
};

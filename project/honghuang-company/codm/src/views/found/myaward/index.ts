import IntegralRecordList from '@components/IntegralRecordList';
import { Component } from 'vue-property-decorator';
import BaseVue from '@helpers/BaseVue';

@Component({
  name: 'myaward',
  components: {
    IntegralRecordList,
  },
})
export default class MyawardPage extends BaseVue {
  public msg = 'myaward-page';
};

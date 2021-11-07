import V4VideoCardList from '@components/V4VideoCardList';
import { Component } from 'vue-property-decorator';
import BaseVue from '@helpers/BaseVue';

// note: 排位攻略
@Component({
  name: 'rank',
  components: {
    V4VideoCardList,
  },
})
export default class rankPage extends BaseVue {
  public v4Id = 112114;
};

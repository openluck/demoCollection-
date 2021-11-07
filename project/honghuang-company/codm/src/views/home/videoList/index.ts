import { Component } from 'vue-property-decorator';
import V4VideoCardList from '@components/V4VideoCardList';
import BaseVue from '@helpers/BaseVue';
import { homeStore } from '@store/modules/home';

@Component({
  name: 'videoList',
  components: { V4VideoCardList },
})
export default class VideoListPage extends BaseVue {
  public v4Id = this.$route.params.id;

  public created() {
    this.setNavTitle();
  }

  public destroyed() {
    homeStore.setTitle('使命召唤微社区');
  }

  private setNavTitle() {
    const { title } = this.$route.query;
    homeStore.setTitle(decodeURIComponent(title as string));
  }
}

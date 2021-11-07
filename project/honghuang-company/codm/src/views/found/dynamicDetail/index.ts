import { Component, Watch, Mixins } from 'vue-property-decorator';
import { convertHttps, timeFormat, area, plat } from '@vueUtils/filters';
import Loading from '@components/Loading';
import Comment from '@components/Comment';
import Empty from '@components/Empty';
import { getDynamicDetail } from '@/services/dynamic';
import DynamicLikeMixin from '../../../mixins/DynamicLikeMixin';
import { globalConfig } from '@/config';

@Component({
  name: 'dynamicDetail',
  components: { Loading, Comment, Empty },
  filters: { convertHttps, timeFormat, plat, area },
})
export default class DynamicDetail extends Mixins(DynamicLikeMixin) {
  public detail: IDynamicInfoListItem | null = null;

  public picList: IPListItem[] = [];

  public error = false;

  public loading = true;

  public defalutAvatar = globalConfig.defaultUserAvatarUrl;

  public created() {
    this.getData();
  }

  @Watch('$route.params.id')
  public updateData() {
    if (this.$route.name === 'found-dynamicDetail') {
      this.getData();
    }
  }

  public getCls() {
    const length = this.picList.length;
    if (length === 2) {
      return 'article-img img2';
    }
    if (length === 3) {
      return 'article-img img3';
    }
    if (length >= 4) {
      return 'article-img img4';
    }
    return 'article-img';
  }

  public async getData() {
    const id = this.$route.params.id;
    if (!id) {
      this.error = true;
      this.$toast('未知的动态 id 哦');
      return;
    }
    this.detail = (await this.fetchDetail(id)) as IDynamicInfoListItem;
    this.likeInfo = {
      isLike: this.detail.userOper,
      count: this.detail.approvalNum,
    };
    if (this.detail?.contentForm === 2) {
      this.picList = JSON.parse(this.detail.piclist as any) as IPListItem[];
    }
    this.loading = false;
  }

  private async fetchDetail(id: string) {
    const ret = await getDynamicDetail(id);
    if (ret.code === 0) {
      this.error = false;
      return ret.data;
    }
    this.error = true;
    return null as any;
  }
}

import { Component, Prop, Watch } from 'vue-property-decorator';
import TopicList from '@components/TopicList';
import BaseVue from '@helpers/BaseVue';
import DynamicCard from '@components/DynamicCard';
import OwnWaterfall from '@components/Waterfall';
import Empty from '@components/Empty';
import {
  getHottestMomentList,
  getLatestMomentList,
  getMomentCommentNumber,
  getMomentListByTopic,
  getUserMomentList,
} from '@/services/dynamic';
import { storage } from '@helpers/storage';

export type TabType = 'hottest' | 'latest' | 'all' | 'topic' | 'own';

export type IDspDynamicInfoListItem = IBaseDynamicInfoListItem & { igNum?: { comment: number } };

interface IEvents {
  clickTopic: {};
}

@Component({
  name: 'dynamicWaterfall',
  components: {
    DynamicCard,
    OwnWaterfall,
    TopicList,
    Empty,
  },
})
export default class DynamicWaterfall extends BaseVue<{}, IEvents> {
  @Prop({ default: false })
  public readonly hideTopic!: boolean;

  @Prop({ default: 'latest' })
  public readonly tab!: TabType;

  @Prop({})
  public readonly onClickTopic!: () => void;

  public currentType: TabType = this.tab;

  public dynamicList: IDspDynamicInfoListItem[] = [];

  public isError = false;

  // note: 记录是否还有下一页数据
  public showMore = true;

  // 正在加载数据
  public loading = true;

  // 无数据状态
  public noData = false;

  public pageTime: string | number = '';

  private currentTopicId = 0;

  private currentTopicCount: number | null = null;

  private pageSize = 6;

  private page = 1;

  public async mounted() {
    this.currentType = this.tab || 'latest';
    this.currentTopicId = 0;
    this.currentTopicCount = null;
    const list = await this.getData(this.getUserId());
    this.dynamicList = list;
    this.closeMore();
  }

  public destroyed() {
    this.dynamicList = [];
  }

  @Watch('tab')
  public async updateDynamicList() {
    if (this.$route.name === 'found-square') {
      if (this.loading) {
        return;
      }
      if (this.tab && this.tab !== 'topic') {
        this.scrollToTop();
        this.loading = true;
        this.currentType = this.tab;
        this.currentTopicId = 0;
        this.dynamicList = [];
        this.noData = false;
        this.page = 1;
        this.pageTime = '';
        this.showMore = true;
        this.currentTopicCount = null;
        const list = await this.getData();
        this.$nextTick(() => {
          this.dynamicList = list;
          this.closeMore();
        });
      }
    }
  }

  public async handleScrollLoadMore() {
    if (this.noData) {
      return;
    }
    if (this.loading) {
      return;
    }
    if (!this.showMore) {
      return;
    }
    this.page++;
    this.loading = true;
    let id = '';
    if (this.currentType === 'topic') {
      id = `${this.currentTopicId}`;
    }
    const list = await this.getData(id);
    this.dynamicList = this.dynamicList.concat(list);
    this.closeMore();
  }

  public reloadWaterfall() {}

  public async handleTopicTabChange(topic: IUgcTopicItem) {
    if (this.loading) {
      return;
    }
    const id = topic.topicid;
    if (this.currentTopicId === id) {
      return;
    }
    this.scrollToTop();
    // 通知父组件，
    this.onClickTopic && this.onClickTopic();
    this.dynamicList = [];
    this.loading = true;
    this.noData = false;
    this.page = 1;
    this.currentTopicId = id;
    this.currentType = 'topic';
    this.showMore = true;
    this.currentTopicCount = topic.contentCnt;
    if (this.currentTopicCount === 0) {
      this.dynamicList = [];
      this.noData = true;
      this.closeMore();
      return;
    }
    const list = await this.getData(`${id}`);
    this.getDynamicComment(list);
    this.dynamicList = list;
    this.closeMore();
  }

  private scrollToTop() {
    const scrollWrap = document.querySelector('.sui-scroll');
    if (scrollWrap) {
      if (scrollWrap.scrollTop > 0) {
        scrollWrap.scrollTop = 0;
      }
    }
  }

  private closeMore() {
    setTimeout(() => {
      this.loading = false;
    }, 300);
  }

  private getUserId() {
    if (this.tab === 'own') {
      const { authMap } = storage.getBySession(['authMap']);
      if (authMap.openid) {
        return authMap.openid;
      }
    }
    return '';
  }

  private async getData(id?: string) {
    switch (this.currentType) {
      case 'hottest':
        return this.fetchHottestDynamic();
      case 'latest':
        return this.fetchLatestDynamic();
      case 'own':
        return this.fetctUserDynamicList();
      case 'topic':
        return this.fetchDynamicByTopic(id as string);
      default:
        return [] as any;
    }
  }

  private parserRawDynamicList(list: IDynamicInfoListItem[]): IBaseDynamicInfoListItem[] {
    if (!list || list.length === 0) {
      return [];
    }
    const ret: IBaseDynamicInfoListItem[] = [];
    for (const item of list) {
      const data = this.parserDynamicData(item);
      ret.push(data);
    }
    return ret;
  }

  private parserDynamicData(data: IDynamicInfoListItem): IBaseDynamicInfoListItem {
    return {
      aid: data.aid,
      // 点赞数
      approvalNum: data.approvalNum,
      articleType: data.articleType,
      author: {
        ...data.author,
      },
      authorAvatar: data.authorAvatar,
      authorName: data.authorName,
      content: data.content,
      publishTime: data.publishTime,
      piclist: data.piclist,
      picnum: data.picnum,
      userOper: data.userOper,
      title: data.title,
      topics: data.topics,
      topicsInfo: data.topicsInfo,
      openid: data.openid,
    };
  }

  // note: 获取最新动态
  private async fetchLatestDynamic() {
    const ret = await getLatestMomentList(this.pageSize, this.pageTime as number);
    if (ret.code === 0) {
      this.isError = false;
      const { infolist, nextPageTime } = ret.data;
      this.pageTime = nextPageTime;
      const list = infolist || [];
      const l = this.parserRawDynamicList(list);
      await this.getDynamicComment(l);
      if (!this.checkHasData(list.length)) {
        return [];
      }
      return l;
    }
    this.showErrorOrNoDataHint();
    return [];
  }

  private checkHasData(length: number, total?: number): boolean {
    if (length === 0 && this.dynamicList.length === 0) {
      this.noData = true;
      return false;
    }
    if (typeof total !== 'undefined' && total === length) {
      this.showMore = false;
    }
    if (length === 0) {
      this.showMore = false;
    }
    return true;
  }

  // note: 获取最热动态
  private async fetchHottestDynamic() {
    const ret = await getHottestMomentList(this.pageSize, this.page);
    if (ret.code === 0) {
      this.isError = false;
      const { infolist } = ret.data;
      const list = infolist || [];
      const l = this.parserRawDynamicList(list);
      await this.getDynamicComment(l);
      if (!this.checkHasData(list.length)) {
        return [];
      }
      return l;
    }
    this.showErrorOrNoDataHint();
    return [];
  }

  // note: 根据话题筛选动态
  private async fetchDynamicByTopic(topicId: string) {
    const ret = await getMomentListByTopic(this.pageSize, this.page, topicId);
    if (ret.code === 0) {
      this.isError = false;
      const { infolist } = ret.data;
      const list = infolist || [];
      const l = this.parserRawDynamicList(list);
      await this.getDynamicComment(l);
      if (this.currentTopicCount !== null) {
        if (this.currentTopicCount === infolist.length + this.dynamicList.length) {
          this.showMore = false;
        }
      }
      if (!this.checkHasData(list.length)) {
        return [];
      }
      return l;
    }
    this.showErrorOrNoDataHint();
    return [];
  }

  private showErrorOrNoDataHint() {
    if (this.dynamicList.length === 0) {
      this.noData = true;
      this.isError = true;
    }
  }

  // note: 查询用户 动态
  private async fetctUserDynamicList() {
    const ret = await getUserMomentList(this.pageSize, this.page, this.getUserId());
    if (ret.code === 0) {
      this.isError = false;
      const { infolist, total } = ret.data;
      const list = infolist || [];
      const l = this.parserRawDynamicList(list);
      await this.getDynamicComment(l);
      if (!this.checkHasData(list.length, total)) {
        return [];
      }
      return l;
    }
    this.showErrorOrNoDataHint();
    return [];
  }

  private async getDynamicComment(list: IDspDynamicInfoListItem[]) {
    if (list.length === 0) {
      return;
    }
    const params = list.map(item => `all_mobile,202012,${item.aid}_ingame`);

    const ret = await getMomentCommentNumber(params.join(';'));
    if (ret.code === 0) {
      if (ret.data) {
        const commentList = ret.data.statList;
        for (let arr = commentList, i = 0; i < arr.length; i++) {
          const item = arr[i];
          const aid = item.objid.split('_')[0];
          if (aid === list[i].aid) {
            list[i].igNum = {
              comment: item.num,
            };
          }
        }
      }
    }
  }
}

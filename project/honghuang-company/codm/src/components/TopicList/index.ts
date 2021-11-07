import { Component, Prop, Watch } from 'vue-property-decorator';
import BaseVue from '@helpers/BaseVue';
// import { getHotTopic } from '@/services/dynamic';
import TopicItem from '@components/TopicItem';
import { getUgcTopicList } from '@services/dynamic';
import { TabType } from '../DynamicWaterfall';

@Component({ components: { TopicItem } })
export default class TopicList extends BaseVue {
  @Prop({ required: true })
  public readonly handleTopicItemClick!: (topic: IUgcTopicItem) => void;

  @Prop({})
  public readonly type!: TabType;

  public topicList: IUgcTopicItem[] = [];

  public currentTopicId = 0;

  @Watch('type')
  public clearTopicId() {
    if (this.type !== 'topic' && this.$route.name === 'found-square') {
      this.currentTopicId = 0;
    }
  }

  public created() {
    this.setData();
  }

  // note: 点击话题
  public handleClickTopic(topic: IUgcTopicItem) {
    this.currentTopicId = topic.topicid;
    this.handleTopicItemClick(topic);
  }

  private async setData() {
    this.topicList = await this.fetchTopicData();
  }

  private async fetchTopicData() {
    // const ret = await getHotTopic();
    const ret = await getUgcTopicList(1, 20);
    if (ret.code === 0) {
      return ret.data.topics || [];
    }
    return [];
  }

  // private sortTopic(list: IUgcTopicItem[]) {
  //   return list.sort((a, b) => b.order - a.order);
  // }
}

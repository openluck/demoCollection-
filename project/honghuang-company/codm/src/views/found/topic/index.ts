import { Component } from 'vue-property-decorator';
import TopicList from '@components/TopicList';
import BaseVue from '@helpers/BaseVue';
import { foundStore } from '@store/modules/found';

@Component({
  name: 'topic',
  components: { TopicList },
})
export default class topicPage extends BaseVue {
  public handleTopicClick(topic: IUgcTopicItem) {
    foundStore.setTopic(topic);
    setTimeout(() => {
      this.$router.back();
    });
  }
}

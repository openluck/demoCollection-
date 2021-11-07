import { Component } from 'vue-property-decorator';
import BaseVue from '@helpers/BaseVue';
import V4VideoCardList from '@components/V4VideoCardList';
import V4ListItem from '@components/V4ListItem';
import { storage } from '@/helpers/storage';

// type TabType = 'sensitivity' | 'rank' | 'keybroad' | 'play' | 'new';
type TabType = 'sensitivity' | 'keybroad' | 'new';

@Component({
  name: 'growUP',
  components: {
    V4VideoCardList,
    V4ListItem,
  },
})
export default class GrowUpPage extends BaseVue {
  public v4IdMap: { [key in TabType]: number } = {
    new: 114104,
    keybroad: 114106,
    sensitivity: 114105,
    // play: 112115,
    // rank: 112115,
  };

  public tab: TabType = this.initTab() as TabType;

  public destroyed() {
    this.cacheTabType();
  }

  public async handleClickTabTap(type: TabType) {
    if (this.tab === type) {
      return;
    }
    this.tab = type;
  }

  private initTab() {
    const { growUpTab } = storage.getBySession(['growUpTab']);
    this.clearCacheTabType();
    return growUpTab || this.$route.query.tab || 'new';
  }

  private clearCacheTabType() {
    storage.setBySession({ growUpTab: '' });
  }

  private cacheTabType() {
    storage.setBySession({ growUpTab: this.tab });
  }
}

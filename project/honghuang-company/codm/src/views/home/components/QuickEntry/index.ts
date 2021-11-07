import { Component, Mixins } from 'vue-property-decorator';
import { getQuickEntryConfig } from '@/services/home';
import MossOperationMixin from '@/mixins/MossOperationMixin';
import OwnRouteLink from '@components/OwnRouteLink';

@Component({
  name: 'QuickEntry',
  components: { OwnRouteLink },
})
export default class QuickEntry extends Mixins(MossOperationMixin) {
  public entryList: IQuickEntryItem[] = this.getOldData('homeQuickEntry') || [];
  public created() {
    this.fetchData();
  }

  private async fetchData() {
    const ret = await getQuickEntryConfig();
    if (ret.code === 0) {
      this.entryList = this.parserRawData(ret.data, 'homeQuickEntry');
      this.setOldData('homeQuickEntry', this.entryList);
    }
  }
}

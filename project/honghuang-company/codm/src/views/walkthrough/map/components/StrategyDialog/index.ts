import { Component, Mixins, Prop } from 'vue-property-decorator';

import { walkthroughtStore } from '@/store/modules/walkthrougth';
import PlayVideoMixin from '@/mixins/PlayVideoMixin';
import { getV4VideoDetail } from '@/services/commons';
import Loading from '@components/Loading';

interface IGuideData {
  vid: string;
  title: string;
  img: string;
}

@Component({
  components: { Loading },
})
export default class StrategyDialog extends Mixins(PlayVideoMixin) {
  @Prop({ required: true })
  public currentV4Id!: string;

  public nextData: IGuideData = { vid: '', title: '', img: '' };
  public prevData: IGuideData = { vid: '', title: '', img: '' };
  public currentData: IGuideData = { vid: '', title: '', img: '' };
  public showPrevBtn = true;
  public showNextBtn = true;
  public loading = true;
  public v4id = this.currentV4Id;

  private index = -1;

  public created() {
    this.index = this.findCurrentVidIndex();
    this.init('init');
  }

  public handleNext() {
    if (this.loading) {
      return;
    }
    this.index += 1;
    this.init('next');
  }

  public handleReport() {
    this.$mosso.report('btn', `map-nail-play-${this.v4id}`, '点击攻略地图钉视频播放时触发');
  }

  public handlePrev() {
    if (this.loading) {
      return;
    }
    this.index -= 1;
    this.init('prev');
  }

  public handleClose() {
    walkthroughtStore.hideDialog();
  }

  protected getVideoId() {
    return this.currentData.vid;
  }

  protected getTitle() {
    return this.currentData.title;
  }

  protected getVideoPoster() {
    return this.currentData.img;
  }

  private async init(type: 'init' | 'prev' | 'next') {
    const v4Ids = walkthroughtStore.v4Ids;
    this.loading = true;
    this.showPrevBtn = this.index !== 0;
    this.showNextBtn = this.index !== v4Ids.length;
    if (type !== 'init') {
      this.v4id = v4Ids[this.index];
    }
    await this.getDetail();
    this.createVideo();
    await this.getOtherDetail();
    this.loading = false;
  }

  private findCurrentVidIndex() {
    const v4Ids = walkthroughtStore.v4Ids;
    for (let i = 0; i < v4Ids.length; i++) {
      const vid = v4Ids[i];
      if (vid === this.v4id) {
        return i;
      }
    }
    return -1;
  }

  private async getDetail() {
    const ret = await getV4VideoDetail(parseInt(this.v4id, 10));
    if (ret.code === 0) {
      this.currentData = this.convertRawData(ret.data);
    }
  }

  private async getOtherDetail() {
    const index = this.index;
    const v4Ids = walkthroughtStore.v4Ids;
    if (index > -1) {
      const prev = v4Ids[index - 1];
      const next = v4Ids[index + 1];

      if (!prev) {
        this.showPrevBtn = false;
      }

      if (!next) {
        this.showNextBtn = false;
      }

      if (prev && !next) {
        const ret = await getV4VideoDetail(parseInt(prev, 10));
        if (ret.code === 0) {
          this.prevData = this.convertRawData(ret.data);
        }
      } else if (next && !prev) {
        const ret = await getV4VideoDetail(parseInt(next, 10));
        if (ret.code === 0) {
          this.nextData = this.convertRawData(ret.data);
        }
      } else if (prev && next) {
        const [v1, v2] = await Promise.all([
          getV4VideoDetail(parseInt(next, 10)),
          getV4VideoDetail(parseInt(prev, 10)),
        ]);
        if (v1.code === 0) {
          this.nextData = this.convertRawData(v1.data);
        }
        if (v2.code === 0) {
          this.prevData = this.convertRawData(v2.data);
        }
      }
    }
  }

  private convertRawData(data: IV4DetailData): IGuideData {
    return {
      img: data.sIMG,
      title: data.sTitle,
      vid: data.sVID,
    };
  }
}

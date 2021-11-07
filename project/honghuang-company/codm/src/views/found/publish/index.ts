import TopicItem from '@components/TopicItem';
import { Component } from 'vue-property-decorator';
import BaseVue, { BaseRef } from '@helpers/BaseVue';
import { checkDynamicUploadImage, generateDynamicImageSignature, subitDynamic } from '@/services/dynamic';
import {
  DYNAMIC_TEXT_LIMIT,
  globalConfig,
  TENCENT_OSS_BUCKEY,
  UPLOAD_IMAGE_LIMIT,
  UPLOAD_IMAGE_MAX_SIZE,
} from '@/config';
import COS from 'cos-js-sdk-v5';
import { imageOptimization, encodeUnicode } from '@tencent/slug-function-vue';
import { foundStore } from '@store/modules/found';
import ingame from '@/helpers/IngameConfigParser';
import { getUgcConfig, queryWhiteForUser } from '@services/commons';
import { storage } from '@helpers/storage';

interface IRefs extends BaseRef {
  inputRef: HTMLInputElement;
}

interface IUploadImage {
  file: File;
  url: string;
  online: string;
  error: boolean;
}

@Component({
  name: 'publish',
  components: {
    TopicItem,
  },
})
export default class PublicDynamicPage extends BaseVue<IRefs> {
  public uploadImgs: IUploadImage[] = [];

  public imgMax = UPLOAD_IMAGE_LIMIT;

  public canPublishLink = false;

  public content = '';

  private publishLock = false;

  public get topicList() {
    return foundStore.topics;
  }

  public destroyed() {
    foundStore.clearSelectTopic();
  }

  public created() {
    this.initUploadImgs();
    /* if(!window.__UgcConfig.moment){
          this.$toast(window.__UgcConfig.tips);
          return ;
      }
      this.tcVideo = new TcVod({
          getSignature() {
              return request({
                path: '/gingame/ugc/get_ydb_signature',
                query: {
                    moduleid: 'moment'
                }
              }).then((result:any) => {
                  return result.signature
              })
          }
      }) */
    // 判断是否在【视频发布白名单】内
    /* request({
      path: '/gingame/ugc/query_white_for_user',
      query: {
        white_id: 1,
      },
    }).then((result: any) => {
      this.canPublishVideo = Boolean(result.white);
    }); */
    // 判断是否在【链接发布白名单】内
    Promise.all([this.getUgcConfig(), queryWhiteForUser()]).then(res => {
      this.canPublishLink = Boolean(res[1].data.white);
    });
  }

  public mounted() {
    this.scrollHeight();
  }

  public handleDeleteTopicIcon() {
    foundStore.clearSelectTopic();
  }

  public deleteImage(index: number) {
    this.uploadImgs.splice(index, 1);
  }

  public async submitDynamic() {
    const win = window as any;
    if (!win.__UgcConfig.moment) {
      this.$toast(win.__UgcConfig.tips);
      return;
    }

    let imgsUnfinish = false;
    for (const item of this.uploadImgs) {
      if (item.error || !item.online) {
        imgsUnfinish = true;
        break;
      }
    }

    if (imgsUnfinish) {
      this.$toast('还有图片未上传完成, 请稍后');
      return;
    }

    this.content = this.content.trim();

    if (this.content.length > DYNAMIC_TEXT_LIMIT) {
      this.$toast(`最多只能发表 ${DYNAMIC_TEXT_LIMIT} 个字喔`);
      return;
    }

    const isCanPub = this.linkWhiteUserCheck();
    // 链接白名单检测，不在白名单内不允许发链接
    if (!isCanPub && /\[[\s\S]*?\][\\(（][\s\S]*?[\\)）]/g.test(this.content)) {
      this.$toast('不能发布带超链接结构的内容哦，链接结构为： [example link](http://example.com)');
      return;
    }

    let topicId = '';
    const topicItem = this.topicList[0];
    if (topicItem) {
      topicId = `${topicItem.topicid}`;
    }

    if (!this.content && this.uploadImgs.length === 0) {
      this.$toast('不能发布空的动态哦!!');
      return;
    }
    if (this.publishLock) {
      return;
    }
    this.publishLock = true;
    const data = {
      content: encodeUnicode(this.content).replace(/\n/g, '<br>'),
      cids: '', // 防止出现 undefined 导致发布失败
      topics: topicId, // 防止出现 undefined 导致发布失败
      piclist: '',
    };

    // /* #region 发布上传视频 */
    // if (this.video.id) {
    //   data.videoType = this.video.type; // 视频类型：1（腾讯视频），2（腾讯云点播），3(平台点播url)
    //   data.vid = this.video.id;
    //   data.videoUrl = this.video.online;
    // }
    /* #endregion */
    /* #region 发布图片 */
    if (this.uploadImgs.length > 0) {
      const urls = this.uploadImgs.map(item => item.online);
      data.piclist = urls.join(',');
    }
    /* #endregion */

    const ret = await subitDynamic(data);

    if (ret.code === 200 || ret.code === 0) {
      this.$toast('发布成功');
      const aid = ret.data.aid;
      this.publishLock = false;
      this.$router.replace(`/found/dynamic_detail/${aid}`);
    } else {
      this.publishLock = false;
      if (ret.code === 7) {
        this.$toast('发布太快啦，休息下再试试吧');
        return;
      }

      if (ret.code === -1024) {
        this.$toast('还没有登录，请先登录再试试吧');
        return;
      }
      const { tokenParams } = storage.getBySession(['tokenParams']);
      this.reportUploadFailMessage(
        `发布动态失败 ${JSON.stringify(ret)}; msg: ${ret.msg}; code: ${ret.code}`,
        ret.code,
        { tokenParams },
      );
      this.$toast('发布失败了呢? 休息下再试试吧');
    }
  }

  public handleDeleteTopicItem(index: number) {
    foundStore.deleteTopic(index);
  }

  public handleAddTopic() {
    storage.set({ publishImages: this.uploadImgs, publishContent: this.content });
    this.$router.push('/found/topic');
  }

  public async reUpload(index: number) {
    const img = this.uploadImgs[index];
    if (!img.error) {
      return;
    }
    await this.handleUpload([img.file], index);
  }

  public async selectImages() {
    const files = this.$refs.inputRef.files;
    if (!files || files.length === 0) {
      return;
    }
    const fileList = Array.from(files);
    await this.handleUpload(fileList);
  }

  private linkWhiteUserCheck() {
    // 白名单管理配置
    const config = ingame.getIngameConfig();
    const whiteUser = config.whiteUser;
    // 链接白名单检测,没有配置whiteUser相当于打开白名单
    if (whiteUser) {
      return whiteUser.link ? this.canPublishLink : false;
    }
    return this.canPublishLink;
  }

  private async handleUpload(files: File[], index?: number) {
    const [suffixs, images] = this.validateUploadFiles(files);

    if (!suffixs || !images) {
      return;
    }
    if (typeof index === 'undefined') {
      this.uploadImgs = this.uploadImgs.concat(images);
    } else {
      this.uploadImgs.splice(index, 1, ...images);
    }

    // 生成图片签名
    const ret = await generateDynamicImageSignature(suffixs);
    if (ret.code !== 0) {
      const imgs = images.map(item => {
        // eslint-disable-next-line no-param-reassign
        item.error = true;
        return item;
      });
      // 重传逻辑
      if (typeof index === 'undefined') {
        const length = this.uploadImgs.length;
        this.uploadImgs.splice(length - imgs.length, imgs.length, ...imgs);
      } else {
        this.uploadImgs.splice(index, 1, ...imgs);
      }
      return this.$toast('上传失败了, 请稍后再试试!');
    }
    const signs = ret.data;
    if (signs.length === 0) {
      return;
    }
    const p: Promise<Blob>[] = [];
    for (const img of images) {
      p.push(imageOptimization(img.file, 0.7) as Promise<Blob>);
    }
    const blobs = (await Promise.all(p)) as Blob[];
    const count = this.uploadImgs.length;
    // note: 最大上线是 9, 每次并发 6 个
    if (blobs.length > 6) {
      await this.doUpload(blobs.slice(0, 6), signs.slice(0, 6), images.slice(0, 6));
      if (typeof index === 'undefined') {
        // note: 上传完成之后, 替换原先的数据
        this.uploadImgs.splice(count - 6, 6, ...images.slice(0, 6));
      } else {
        this.uploadImgs[index] = images[0];
      }
      await this.doUpload(blobs.slice(6), signs.slice(6), images.slice(6));
      if (typeof index === 'undefined') {
        // note: 上传完成之后, 替换原先的数据
        const len = images.length - 6;
        this.uploadImgs.splice(count - len, len, ...images.slice(6));
      } else {
        this.uploadImgs[index] = images[0];
      }
    } else {
      await this.doUpload(blobs, signs, images);
      if (typeof index === 'undefined') {
        // note: 上传完成之后, 替换原先的数据
        this.uploadImgs.splice(count - images.length, images.length, ...images);
      } else {
        this.uploadImgs[index] = images[0];
      }
    }
  }

  private async doUpload(blobs: Blob[], signs: IDynamicPicSignature[], images: IUploadImage[]) {
    const cosList: (COSInstance | null)[] = [];
    for (const item of signs) {
      if (item.tmpSecretKey) {
        const cos = new COS({
          // eslint-disable-next-line @typescript-eslint/naming-convention
          getAuthorization(_, callback) {
            callback({
              TmpSecretId: item.tmpSecretId,
              TmpSecretKey: item.tmpSecretKey,
              XCosSecurityToken: item.sessionToken,
              ExpiredTime: item.expiredTime,
              ScopeLimit: true,
            });
          },
        });
        cosList.push(cos);
      } else {
        cosList.push(null);
        this.reportUploadFailMessage('获取签名数据失败', -100, item);
      }
    }
    const p: Promise<string>[] = [];
    for (let i = 0; i < cosList.length; i++) {
      const cos = cosList[i];
      const key = signs[i].url;
      const blob = blobs[i];
      if (cos) {
        p.push(
          new Promise((ok, fail) => {
            cos.sliceUploadFile(
              {
                Bucket: TENCENT_OSS_BUCKEY.TGL,
                Region: 'ap-guangzhou',
                Key: key,
                Body: blob,
              },
              (error, data) => {
                if (error) {
                  fail(error);
                  return;
                }
                ok(`https://${data.Location}`);
              },
            );
          }),
        );
      } else {
        p.push(Promise.resolve(''));
      }
    }
    const ret = await Promise.all(p);
    const pList: ReturnType<typeof checkDynamicUploadImage>[] = [];
    for (let i = 0; i < ret.length; i++) {
      const u = ret[i];
      if (u) {
        pList.push(checkDynamicUploadImage(u));
      } else {
        pList.push(Promise.resolve({ code: -1 } as any));
      }
    }

    const res = await Promise.all(pList);
    for (let arr = res, i = 0; i < arr.length; i++) {
      const online = ret[i];
      images[i].online = online;
      // note: 不处理 图片预检查接口的报错
      // if (item.code !== 0) {
      //   // eslint-disable-next-line no-param-reassign
      //   images[i].error = true;
      //   this.reportUploadFailMessage(item.msg, item.code, item.data);
      // } else {
      //   // eslint-disable-next-line no-param-reassign

      // }
    }
  }

  private reportUploadFailMessage(msg: string, code: number, data: any = {}) {
    if (globalConfig.mode !== 'production') {
      return;
    }
    (window as any).Raven.captureException('手动错误上报', {
      level: 'error',
      logger: '手动上报',
      extra: {
        auth: '',
        date: new Date(),
        message: `${msg}; code: ${code}`,
        ...data,
      },
    });
  }

  private validateUploadFiles(files: File[]): [string[]?, IUploadImage[]?] {
    const suffixs = [];
    const images = [];
    let typeInvalid = false;
    let sizeInvalid = false;
    for (const file of files) {
      if (!/^image\//i.test(file.type)) {
        typeInvalid = true;
        continue;
      }
      if (file.size > UPLOAD_IMAGE_MAX_SIZE) {
        sizeInvalid = true;
        continue;
      }
      const image: IUploadImage = {
        file,
        url: URL.createObjectURL(file),
        error: false,
        online: '',
      };
      images.push(image);
      const match = file.name.match(/[^\\.]+$/);
      if (match) {
        suffixs.push(match[0]);
      }
    }
    if (typeInvalid) {
      this.$toast('只能选择图片文件喔');
    }
    if (sizeInvalid) {
      this.$toast('只能选择图片文件喔');
    }
    if (images.length === 0) {
      return [];
    }
    if (images.length + this.uploadImgs.length > this.imgMax) {
      this.$toast(`最多上传 ${this.imgMax} 张图哦`);
      return [];
    }
    return [suffixs, images];
  }

  private initUploadImgs() {
    const { publishImages, publishContent } = storage.get(['publishImages', 'publishContent']);
    if (publishImages && publishImages.length > 0) {
      this.uploadImgs = publishImages;
    }
    if (publishContent) {
      this.content = publishContent;
    }
    this.clearUploadImgsInStorage();
  }

  private clearUploadImgsInStorage() {
    storage.set({ publishImages: [], publishContent: '' });
  }

  private async getUgcConfig() {
    const config = (window as any).__UgcConfig;
    if (typeof config === 'undefined') {
      const { data } = await getUgcConfig();
      return data;
    }
    return config;
  }

  private scrollHeight() {
    // iphone8 页面不回弹
    const el = document.getElementsByTagName('textarea')[0];
    if (el) {
      el.addEventListener('blur', () => {
        window.scrollTo(0, 0);
      });
    }
  }
}

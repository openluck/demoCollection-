import { Vue, Component } from 'vue-property-decorator';
import { cloudImageURL, CloudImageURLOptions } from '@tencent/slug-function-vue';
import { TENCENT_OSS_BUCKEY } from '@/config';
import { NavigationGuardNext, Route } from 'vue-router';
import { appStore } from '@/store/modules/app';
import { storage } from '@/helpers/storage';

export type BaseRef = { [key: string]: Element | HTMLElement };

export interface EmitType {
  [key: string]: any[] | any;
}

@Component
class BaseVue<R extends BaseRef = {}, E extends EmitType = {}> extends Vue {
  // note: 在渲染该组件的对应路由被 confirm 前调用
  // 不！能！获取组件实例 `this`
  // 因为当守卫执行前，组件实例还没被创建
  public static beforeRouteEnter: (to: Route, from: Route, next: NavigationGuardNext<Vue>) => void;

  public $refs: R = {} as any;

  // note: 在当前路由改变，但是该组件被复用时调用
  // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
  // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
  // 可以访问组件实例 `this`
  public beforeRouteUpdate!: (to: Route, from: Route, next: NavigationGuardNext<Vue>) => void;
  // note: 导航离开该组件的对应路由时调用
  // 可以访问组件实例 `this`
  public beforeRouteLeave!: (to: Route, from: Route, next: NavigationGuardNext<Vue>) => void;

  public get isExperienceEnv() {
    return appStore.isExperienceEnv;
  }

  constructor(...args: any[]) {
    super(args);
    this.$refs = { ...(super.$refs as R) };
  }

  // note: vue hooks
  public created() {} // 子类实现
  public mounted() {} // 子类实现
  public destroyed() {}

  public emit<K extends keyof E>(e: K, args: E[K]): this;
  public emit<K extends keyof E>(e: K, ...args: E[K]): this {
    if (args.length === 0) {
      super.$emit(e as string, {});
    } else {
      super.$emit(e as string, ...(args as IArguments));
    }
    return this;
  }

  public convertImgExt(path: string) {
    const baseUrl = 'https://gzhcos.qq.com/codm';
    if ((window as any).webp) {
      const u = path.split('.')[0];
      return `${baseUrl}/${u}.webp`;
    }
    return `${baseUrl}/${path}`;
  }

  public resetWalkthroughTabTypeAction() {
    storage.setBySession({
      firearmsTab: '',
      gamePlayTab: '',
      growUpTab: '',
      warAreaTab: '',
    });
  }

  /**
   * 使用数据万象对图片进行处理，文档：https://cloud.tencent.com/document/product/460/6929
   * @param {String} url - 需要处理的 url
   * @param {String} rule - 图片处理规则，不包括 format
   * @param {Boolean} format - 是否按需将 png, webp 格式转换为 jpg
   */
  protected mImageView(url: string, rule = '', format = true) {
    if (!url) {
      return '';
    }

    const config: CloudImageURLOptions = {
      buckey: TENCENT_OSS_BUCKEY,
      url,
      rule,
      formatJPG: format,
    };
    return cloudImageURL(config);
  }

  protected reportPagePerformanceMonitoring() {
    const win = window as any;
    const routeName = this.$route.name;
    const fp = win.pageFirstPaint || 100;
    const fcp = win.pageFirstContentPaint;
    if (!win.aegis) {
      return;
    }
    win.aegis.reportTime(`${routeName}-fp`, fp);
    // const fcp = pageFirstContentPaint - fp;
    win.aegis.reportTime(`${routeName}-fcp`, fcp);
    const fmp = win.pageFirstMeaningfulPaint;
    // const fmp = pageFirstMeaningfulPaint - pageFirstContentPaint;
    win.aegis.reportTime(`${routeName}-fmp`, fmp);
    console.log(fp, fcp, fmp);
  }

  protected reportPageContentPop(targetId: string, action: string, targettype: string, from: string) {
    if (!targetId || !action || !targettype || !from) {
      return;
    }
    this.$dmpt.report({
      action, // 必填
      targetid: targetId, // 可选，内容id，如v4的iNewsId / iVideoId / iId
      targettype, // 可选，内容类型，填：news | video
      from, // 可选，内容从哪个平台拉取：v4 | tgl | ingame
    });
  }

  protected reportPageBtn(pageId: string, cnName: string) {
    return this.$mosso.report('btn', pageId, cnName);
  }

  protected parserV4ContentItem(data: IV4ListItemData[]): IBaseV4ContenteListItemData[] {
    if (data.length === 0) {
      return [];
    }
    return data.map(item => ({
      iId: item.iId,
      iInfoType: item.iInfoType,
      iNewsId: item.iNewsId,
      iTotalPlay: this.randomV4ContentPlayCount(item.iTotalPlay, item.iId),
      sAuthor: item.sAuthor,
      sDesc: item.sDesc,
      sIMG: item.sIMG,
      sIdxTime: item.sIdxTime,
      sTitle: item.sTitle,
      sVID: item.sVID,
      sCoverList: item.sCoverList,
    }));
  }

  protected randomV4ContentPlayCount(count: number, base: number) {
    if (count >= 100) {
      return count + 2000;
    }
    return 1000 + 10 * count + (base % 3);
  }

  public get messageCount() {
    return appStore.replyMsgCount + appStore.likeMsgCount;
  }

  // note: 是否有积分可以领取
  public get hasIntegralPick() {
    return appStore.hasIntegralPick;
  }
}

export default BaseVue;

/**
 * note:
 * 具体可以参考： http://moss.oa.com/sy/main#/ingame/config
 *
 * 接入： 通用微社区后台配置之后， 会生成一个 `https://tiem-cdn.qq.com/sy/codm/ingame/scripts/config.js` 的 js 文件
 * 直接通过 script 标签引入,
 * 项目中在 scriptConfig.ts 文件中引入
 */

import { camelize } from '@/utils';

// note: 通用微社区的配置, 通过通用微社区后台配置获取数据
class IngameConfigParser {
  private config: IIngameConfig;
  constructor() {
    this.config = this.genIngameConfig();
  }

  public getIngameConfig() {
    return this.config;
  }

  public getServiceId() {
    return this.config.p0;
  }

  public getDownloadAppConfig() {
    return this.config.downloadNav;
  }

  public isRenderCommentComp() {
    return this.config.options.comment;
  }

  private genIngameConfig() {
    if (typeof window !== 'undefined') {
      const config = (window as any).config;
      return camelize(config) as IIngameConfig;
    }
    return {} as any;
  }
}

const ingame = new IngameConfigParser();
export default ingame;

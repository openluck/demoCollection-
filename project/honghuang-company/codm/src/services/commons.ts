import { slugRequest } from '@tencent/slug-request';
import { globalConfig, apiBaseUrl, sandbox } from '@/config';

export interface ISplashScreenData {
  splashScreenList: {
    id: number;
    splashName: string;
    scenes: 1 | 2 | 3; // 应用场景(全部:1,横屏:2,竖屏:3)
    hImgUrl: string; // 封面图(横屏)
    vImgUrl: string; // 封面图(竖屏)
  }[];
}

/**
 * 获取拍脸图的数据
 */
export async function getSplashScreenData() {
  return await slugRequest<ISplashScreenData>({
    baseUrl: apiBaseUrl,
    path: '/gingame/push/splash_screen_list',
    method: 'GET',
    source: 'backEnd',
    type: 'api',
    query: {
      game: 'codm',
      sandbox,
    },
  });
}

/**
 * 上报拍脸图 浏览和点击数据
 * id: 拍脸图 id
 * behavior: 1 浏览， 2 点击
 */
export async function reportSplashScreenBehavior(id: number, behavior: 1 | 2) {
  return await slugRequest({
    baseUrl: apiBaseUrl,
    path: '/gingame/push/splash_screen_report',
    method: 'GET',
    source: 'backEnd',
    type: 'api',
    query: {
      sandbox,
      game: 'codm',
      id,
      behaviorType: behavior,
    },
  });
}

// note: v4 参数
interface V4ListQuery {
  limit: number;
  start: number;
  tagids: number | string;
  filter?: 'tag' | 'all' | 'channel';
  logic?: 'and' | 'or';
  sortBy?: 'sidxTime' | 'iTotalPlay';
  stime?: string; // 2017-01-01 00:00:00
  etime?: string; // 2017-01-01 00:00:00
}

export async function getV4DataList(query: V4ListQuery) {
  return slugRequest<IV4DataResponseData>({
    method: 'GET',
    baseUrl: 'https://apps.game.qq.com',
    path: '/cmc/cross',
    isAuth: false,
    underlizeQuery: false,
    type: 'api',
    source: 'v4',
    query: Object.assign(
      {
        filter: 'tag',
        logic: 'or',
        serviceId: globalConfig.v4P0,
        sortby: 'sIdxTime',
        typeids: '1,2',
        source: 'ingame',
      },
      query,
    ),
  });
}

export async function getV4AritcleDetail(id: number) {
  return slugRequest<IV4DetailData>({
    method: 'POST',
    baseUrl: 'https://apps.game.qq.com',
    path: '/wmp/v3.1/public/searchNews.php',
    isAuth: false,
    underlizeQuery: false,
    type: 'api',
    source: 'v4',
    query: {
      p0: globalConfig.v4P0,
      source: 'ingame',
      p1: 1,
      id,
    },
  });
}

// note: 获取总投票数: 赞, 踩
// workType: 1 视频 2 文章
export async function getTotalVote(id: string, type: 1 | 2) {
  const config: ApiTypes.HttpRequestConfig = {
    baseUrl: apiBaseUrl,
    path: '/php/ingame/interactcenter/query_user_multi_thumbs.php',
    method: 'GET',
    isAuth: true,
    underlizeQuery: true,
    query: {
      game: 'codm',
      channel: 1,
      worksType: type,
      worksId: id,
      bid: 'ingame_person',
      sandbox,
    },
    type: 'api',
    source: 'backEnd',
  };
  return slugRequest<IThumbsData>(config);
}

// note: 给 id 投票: 1 赞, 2 踩
// workType: 1 视频 2 文章
export async function addV4ContentVote(id: number, type: 1 | 2, worksType: 1 | 2) {
  const config: ApiTypes.HttpRequestConfig = {
    baseUrl: apiBaseUrl,
    path: '/php/ingame/interactcenter/user_multi_thumbs.php',
    method: 'GET',
    isAuth: true,
    underlizeQuery: true,
    query: {
      game: 'codm',
      channel: 1,
      worksId: id,
      worksType,
      bid: 'ingame_person',
      thumbsType: type,
      sandbox,
    },
    type: 'api',
    source: 'backEnd',
  };
  return slugRequest<{ thumbsList: [] }>(config);
}

// note: 取消点赞 或者是 踩 投票, 1 赞, 2 踩
export async function cancelV4ContentVote(id: number, type: 1 | 2, worksType: 1 | 2) {
  const config: ApiTypes.HttpRequestConfig = {
    baseUrl: apiBaseUrl,
    path: '/php/ingame/interactcenter/cancel_user_multi_thumbs.php',
    isAuth: true,
    method: 'GET',
    underlizeQuery: true,
    query: {
      game: 'codm',
      worksId: id,
      worksType,
      bid: 'ingame_person',
      thumbsType: type,
      channel: 1,
      sandbox,
    },
    type: 'api',
    source: 'backEnd',
  };
  return slugRequest(config);
}

// note: 获取 v4 详情数据
export async function getV4VideoDetail(id: number) {
  const config: ApiTypes.HttpRequestConfig = {
    method: 'POST',
    baseUrl: 'https://apps.game.qq.com',
    path: '/wmp/v3.1/public/search.php',
    isAuth: false,
    underlizeQuery: false,
    type: 'api',
    source: 'v4',
    query: {
      p0: globalConfig.v4P0,
      source: 'ingame',
      p1: 1,
      id,
    },
  };
  return slugRequest<IV4DetailData>(config);
}

// note: 上报阅读 v4:  1-视频； 2-资讯；
export function reportV4Read(id: string, type: '1' | '2') {
  return slugRequest<IV4DetailData>({
    method: 'GET',
    baseUrl: 'https://apps.game.qq.com',
    type: 'api',
    source: 'v4',
    path: '/wmp/v3.1/',
    underlizeQuery: false,
    query: {
      p0: globalConfig.v4P0,
      source: 'ingame',
      p1: 'updateTotalPlay',
      p2: id,
      p3: type,
      p5: 1,
    },
  });
}

// 玩法
export function getZlkGamePlayData() {
  const config: ApiTypes.HttpRequestByJsonpConf = {
    source: 'zlk',
    type: 'jsonp',
    underlizeQuery: false,
    url: 'https://codm.qq.com/zlkdatasys/data_zlk_wf2020.json',
    isAuth: false,
    callbackName: 'zlkWf',
  };
  return slugRequest<IGamePlayResponse>(config);
}

// note: 武器
export function getZlkFirearmsData() {
  const config: ApiTypes.HttpRequestByJsonpConf = {
    source: 'zlk',
    type: 'jsonp',
    underlizeQuery: false,
    url: 'https://codm.qq.com/zlkdatasys/data_zlk_wq2020.json',
    isAuth: false,
    callbackName: 'zlkWq',
  };
  return slugRequest<IFirearmsResponse>(config);
}

// note: 活动日历
export function getZlkActivityCalendarData() {
  const config: ApiTypes.HttpRequestByJsonpConf = {
    source: 'zlk',
    type: 'jsonp',
    underlizeQuery: false,
    url: 'https://codm.qq.com/zlkdatasys/data_zlk_111.json',
    isAuth: false,
    callbackName: 'zlkHd',
  };
  return slugRequest<IActivityCalendarResponse>(config);
}

// note: 对人对战 -- 地图攻略
export function getMapGuideData() {
  const config: ApiTypes.HttpRequestByJsonpConf = {
    source: 'zlk',
    type: 'jsonp',
    underlizeQuery: false,
    url: 'https://codm.qq.com/zlkdatasys/data_zlk_dtgl.json',
    isAuth: false,
    callbackName: 'res',
  };
  return slugRequest<ISkillGuideDataResponse>(config);
}

export function getUgcConfig() {
  const config: ApiTypes.HttpRequestByScript = {
    url: 'https://tiem-cdn.qq.com/slugteam/public/config/ugcConfig.js',
    dataName: '__UgcConfig',
    source: 'script',
    type: 'script',
    isAuth: false,
  };
  return slugRequest(config);
}

export function queryWhiteForUser() {
  const config: ApiTypes.HttpRequestConfig = {
    method: 'GET',
    baseUrl: apiBaseUrl,
    type: 'api',
    source: 'backEnd',
    path: '/gingame/ugc/query_white_for_user',
    underlizeQuery: true,
    query: {
      whiteId: 2,
      sandbox,
      game: 'codm',
      bid: 'ingame',
    },
  };
  return slugRequest<{ white: 1 | 0 }>(config);
}

/**
 * 动态加载 script 脚本
 * @param {String} url - 要加载的脚本 url
 * @param {Function} callback - 加载完成后的回调函数
 */
export function loadScript(url: string): Promise<boolean> {
  const script = document.createElement('script');
  script.src = url;
  document.body.appendChild(script);
  return new Promise(resolve => {
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
      // reject(false);
    };
  });
}

export interface ITestListUrlData {
  confUrlInfo: {
    type: string;
    urlList: {
      name: string;
      url: string;
    }[];
  }[];
}

export async function getTestLinkList() {
  return await slugRequest<ITestListUrlData>({
    baseUrl: 'https://itea-cdn.qq.com',
    path: `/file/ingame/codm/urlconf.json?random=${Date.now()}`,
    method: 'GET',
    source: 'cdnJson',
    type: 'cdnJson',
    isAuth: true,
  });
}

// note: 获取测试白名单
export async function getWhiteuserList() {
  return await slugRequest<{ white: 1 | 0 }>({
    path: '/php/ingame/whiteuser/user_white_check.php',
    baseUrl: 'https://app.ingame.qq.com',
    method: 'GET',
    source: 'backEnd',
    type: 'api',
    isAuth: true,
    query: {
      business: 'site', // 分类，默认为site即可
      game: 'codm',
      bid: 'ingame',
      channel: 1,
    },
  });
}

// note: 多个 docid 按逗号分隔, docid 与原先的 id 不同
export async function getV4ContentDetailByIds(docid: string) {
  return slugRequest<IV4DetailData>({
    method: 'GET',
    path: 'https://go.gicp.game.qq.com/cmc/complexDetail',
    isAuth: false,
    underlizeQuery: false,
    type: 'api',
    source: 'v4',
    query: {
      ibiz: globalConfig.v4P0,
      source: 'ingame',
      p1: 1,
      id: docid,
    },
  });
}

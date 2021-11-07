function getRouteBaseUrl() {
  const env = process.env.APP_MODE;
  if (env === 'development') {
    return '/';
  }
  return '/codm';
}

export const baseUrl = getRouteBaseUrl();

/**
 * @file 常量 - 腾讯云
 * @author hardylin <hardylin@tencent.com>
 */
export const TENCENT_OSS_BUCKEY = {
  OSSWEB: 'sy-ossweb-1259052908',
  V4ITEA: 'sy-v4-1259052908',
  V4: 'sy-v4-shp-1259052908',
  TGL: 'tgl-images-1254960240',
};

export const globalConfig = {
  mode: process.env.APP_MODE,
  v4P0: '159',
  gameName: 'codm',
  gameid: 'codm',
  bid: 'ingame',
  bidPerson: 'ingame_person',
  moduleId: 'ingame',
  // 微信公众号的 appid
  // wxappId: 'wx14decdd92a302984',
  integralBaseUrl: 'https://gw.gzh.qq.com/point-wall/api',
  // process.env.APP_MODE === 'production'
  //   ? 'https://gw.gzh.qq.com/point-wall/api'
  //   : 'https://gw.gzh.qq.com/point-wall-pre/point-wall/api',
  gameSource: 'ingame',
  defaultUserAvatarUrl: 'https://tiem-cdn.qq.com/slugteam/public/img/user.png',
  defaultNickname: '匿名用户',
  defautShareImage: 'https://gzhcos.qq.com/codm/logo-icon.png', // 分享图片尺寸200*200，且填写绝对路径
};

export const SITE_IDS = {
  wx: 72,
  qq: 73,
};

// 首页固定入口，json：
export const HOME_QUICK_ENTRY_URL = 'https://tiem-cdn.qq.com/moss/product/codm/statics/operation/1514.json';

// 大神宝典，json：
export const WALKTHROUGH_LABEL_ENTRY_URL = 'https://tiem-cdn.qq.com/moss/product/codm/statics/operation/1516.json';

// 首页轮播图，json：
export const HOME_BANNER_URL = 'https://tiem-cdn.qq.com/moss/product/codm/statics/operation/1499.json';

// 多人对战 -- 终极技能
export const SKILL_CDN_URL = 'https://tiem-cdn.qq.com/moss/product/codm/statics/operation/2553.json';

// note: 使命战场 --- 技能芯片
export const SKILL_CORE_CDN_URL = 'https://tiem-cdn.qq.com/moss/product/codm/statics/operation/2551.json';

// note: 使命战场 --- 进阶技能
export const ADVANCED_SKILLS_CDN_URL = 'https://tiem-cdn.qq.com/moss/product/codm/statics/operation/2823.json';

// note: 使命战场 --- 禁区攻略
export const FORBIDDEN_CDN_URL = 'https://tiem-cdn.qq.com/moss/product/codm/statics/operation/2517.json';

// note: 使命战场 --- 禁区攻略 -- 热门攻略
export const FORBIDDEN_HOT_CDN_URL = 'https://tiem-cdn.qq.com/moss/product/codm/statics/operation/2586.json';

// note: 使命战场 --- evil 恶魔岛攻略
export const EVIL_CDN_URL = 'https://tiem-cdn.qq.com/moss/product/codm/statics/operation/2570.json';

// note: 使命战场 --- evil 恶魔岛攻略 -- 热门攻略
export const EVIL_HOT_CDN_URL = 'https://tiem-cdn.qq.com/moss/product/codm/statics/operation/2620.json';

// note: 武器枪匠 --- 热门 -- 热门枪械
export const FIREADRMS_HOT_GUN_CDN_URL = 'https://tiem-cdn.qq.com/moss/product/codm/statics/operation/2502.json';

// note: 武器枪匠 --- 热门 -- 攻略
export const FIREADRMS_HOT_CDN_URL = 'https://tiem-cdn.qq.com/moss/product/codm/statics/operation/2603.json';

// note: 武器枪匠 --- 枪匠 -- 攻略
export const FIREADRMS_GUN_CDN_URL = 'https://tiem-cdn.qq.com/moss/product/codm/statics/operation/2637.json';

// note: 武器枪匠 --- 枪匠 -- 属性
export const FIREADRMS_GUN_PORPS_CDN_URL = 'https://tiem-cdn.qq.com/moss/product/codm/statics/operation/2536.json';

// 地图资源数据，json：
export const MAP_DATA_URL = 'https://tiem-cdn.qq.com/moss/product/codm/statics/operation/2485.json';

export const LIKE_MESSAGE_TYPE = '1050001';

export const REPLY_MESSAGE_TYPE = '1070002';

export const UPLOAD_IMAGE_LIMIT = 9;

// note: 15 兆, 单位 byte
export const UPLOAD_IMAGE_MAX_SIZE = 15 * 1024 * 1024;

export const DYNAMIC_TEXT_LIMIT = 200;

export const MAP_IMG_BASE_URL = 'https://gzhcos.qq.com/codm/map/';

export const apiBaseUrl =
  process.env.APP_MODE === 'production' ? 'https://app.ingame.qq.com' : 'https://appt.ingame.qq.com';

export const sandbox = process.env.APP_MODE === 'production' ? 0 : 1;

export const V4_CONTENT_LIST_LIMIT = 4;

// export const apiBaseUrl = 'https://app.ingame.qq.com';
// export const sandbox = 0;

export const GAME_APP_EXPERIENCE_ENV_GAME_ID = 27889;

export const GAME_APP_PROD_ENV_GAME_ID = 16283;

export const GRAY_LEVEL_MAP = [
  {
    time: '2021-2-1',
    internal: [0, 20],
  },
  {
    time: '2021-2-2',
    internal: [0, 20],
  },
  {
    time: '2021-2-3',
    internal: [0, 80],
  },
  {
    time: '2021-2-4',
    internal: [0, 80],
  },
];

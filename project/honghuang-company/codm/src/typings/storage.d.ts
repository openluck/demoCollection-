interface LoginParams {
  // 区服 id
  partition: string;
  // 账号类型, 1 wx, 2 qq， 在体验服上，可能是 以 1 开头的数字，或者是 以 2开头的数字
  areaid: string;
  // 角色 id
  roleid: string;
  // 平台类型
  platid: string;
  algorithm: string;
  // 版本
  version: string;
  // 时间戳
  timestamp: string;
  appid: string;
  openid: string;
  gameid: string;
  sig: string;
  encode: string;
  msdkEncodeParam: string;
  gameidV5: string;
}

interface ZLKCacheData {
  fireamrmsData: IFirearmsItemData[];
  modeGuideData: IGamePlayItemData[];
  mapGuideData: IMapGuideData[];
}

// note: moss 广告排期数据缓存
interface ISwiperItem {
  id: number;
  url: string;
  imgUrl: string;
  title: string;
}

interface IQuickEntryItem {
  id: number;
  url: string;
  imgUrl: string;
}

interface ILabelItem {
  id: number;
  url: string;
  imgUrl: string;
  title: string;
  recommended: 'HOT' | 'NEWS';
  sort: number;
}

type CacheMossKey = keyof IMossCacheData;
interface IMossCacheData {
  homeBanner: ISwiperItem[];
  homeQuickEntry: IQuickEntryItem[];
  homeLabel: ILabelItem[];
}

// note: 存在 localStorage 中
interface LocalStorageData extends ZLKCacheData, IMossCacheData {
  publishImages: IUploadImage[];
  publishContent: string;
}

// note: 存在 sessionStorage 中
interface SessionStorageData {
  tokenParams: string;
  authMap: LoginParams;
  entryIndex: boolean;
  // 用户等级
  igPlatform: 'ios' | 'pc' | 'android';
  // 武器枪匠的二级标签
  firearmsTab: string;
  // 多人对战的二级标签
  gamePlayTab: string;
  // 战域的二级标签
  warAreaTab: string;
  // 成长宝典的二级标签
  growUpTab: string;
  // show face ad
  showFaceAd: '0' | '1';
}

type SessionStorageKey = keyof SessionStorageData;
type LocalStorageKey = keyof LocalStorageData;

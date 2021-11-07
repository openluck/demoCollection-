// import { IFiearms } from '../views/walkthrough/firearms/index';
interface IWeaponParams {
  // 精准
  wqszjzD0: string;
  // 控制
  wqszkz60: string;
  // 射程
  wqszscB6: string;
  // 伤害
  wqszshAd: string;
  // 射速
  wqszss17: string;
  // 移动性
  wqszydxD9: string;
}

interface IFirearmsItemData {
  // 武器 v4 id
  wqglv4id34: string;
  // 武器 id
  wqidEf: string;
  // 武器立绘, 列表页
  wqlhEe: string;
  // 立绘, 详情页
  wqlhxqyFb: string;
  // 武器名称
  wqmc1a: string;
  // 配件
  wqpjicon8e: {
    wqpjicon8e: string;
    wqpjmcF2: string;
  }[];
  // 武器配件名称
  wqpjmcF2: string;
  // 武器属性值
  wqszd3b: [IWeaponParams];
  // 一句话攻略
  wqyjhglEb: string;
  wqpjdFd?: {
    wqpjicon8e: string;
    wqpjmcF2: string;
  }[];
  // 类型的 key
  wqflkeyFd: string;
  // 类型
  wqyjfl27: string;
}

interface IGamePlayItemData {
  // 地图
  wfdt7f: string;
  // v4 id
  wfglv4id84: string;
  // 规则
  wfgzjs96: string;
  // id
  wfid9a: string;
  // 立绘 列y页
  wflh1b: string;
  // 立绘头像 详情页
  wflhxqy93: string;
  // 名称
  wfmc95: string;
  // 人数
  wfrs9d: string;
}

interface IFirearmsResponse {
  wqxq4a: IFirearmsItemData[];
}

interface IGamePlayResponse {
  wfxq58: IGamePlayItemData[];
}

interface IActivityCalendarData {
  // 按钮链接
  anljF6: string;
  // 按钮文案
  anwaA1: string;
  // 活动标签
  hdbq29: string;
  // 奖励名称
  jldymcE5: string;
  // 奖励图
  jlt66: string;
  // 时间
  sj5a: string;
  // 主题
  zt9f: string;
  zb1a: 0 | 1;
}

interface IMapMode {
  // 地图适用模式 id
  dtsysms06: string;
  // 封面
  dtmsmc8d: string;
}

// 地图攻略
interface IMapGuideData {
  // 地图攻略
  dtglF8: string;
  // 地图介绍
  dtjs80: string;
  // 地图适用模式
  dtsymsD2: IMapMode[];
  // 地图名称
  dtmmc63: string;
  // 地图攻略 v4 id
  dtglv4id79: string;
  // 地图id
  dtidA6: string;
  // 地图视频介绍
  dtspjs54: string;
  // 立绘
  dtgllh79: string;
  // 封面
  dtmsmc8d: string;
}

interface ISkillGuideDataResponse {
  dtgl20: IMapGuideData[];
}

// note: 活动日历
interface IActivityCalendarResponse {
  hdxx84: IActivityCalendarData[];
}

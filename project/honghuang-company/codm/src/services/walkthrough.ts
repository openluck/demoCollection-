import { slugRequest } from '@tencent/slug-request';
// 地图资源数据
import {
  ADVANCED_SKILLS_CDN_URL,
  EVIL_CDN_URL,
  EVIL_HOT_CDN_URL,
  FIREADRMS_GUN_CDN_URL,
  FIREADRMS_GUN_PORPS_CDN_URL,
  FIREADRMS_HOT_CDN_URL,
  FIREADRMS_HOT_GUN_CDN_URL,
  FORBIDDEN_CDN_URL,
  FORBIDDEN_HOT_CDN_URL,
  SKILL_CDN_URL,
  SKILL_CORE_CDN_URL,
} from '@/config';

// note: 地图资源数据
export function getMapData(url: string) {
  const config: ApiTypes.HttpRequestConfig = {
    method: 'GET',
    source: 'cdnJson',
    type: 'cdnJson',
    path: url,
    isAuth: false,
    underlizeQuery: false,
  };
  return slugRequest<IMossOperationItem[]>(config);
}

// note: 多人对战 --- 终极攻略
export function fetchSkillData() {
  const config: ApiTypes.HttpRequestConfig = {
    method: 'GET',
    source: 'cdnJson',
    type: 'cdnJson',
    path: SKILL_CDN_URL,
    isAuth: false,
    underlizeQuery: false,
  };
  return slugRequest<IMossOperationItem[]>(config);
}

// note: 战域 --- 技能芯片
export function fetchSkillCoreData() {
  const config: ApiTypes.HttpRequestConfig = {
    method: 'GET',
    source: 'cdnJson',
    type: 'cdnJson',
    path: SKILL_CORE_CDN_URL,
    isAuth: false,
    underlizeQuery: false,
  };
  return slugRequest<IMossOperationItem[]>(config);
}

// note: 战域 --- 进阶技能
export function fetchAdvancedSkillsData() {
  const config: ApiTypes.HttpRequestConfig = {
    method: 'GET',
    source: 'cdnJson',
    type: 'cdnJson',
    path: ADVANCED_SKILLS_CDN_URL,
    isAuth: false,
    underlizeQuery: false,
  };
  return slugRequest<IMossOperationItem[]>(config);
}

// note: 战域 --- 禁区
export function fetchForbiddenData() {
  const config: ApiTypes.HttpRequestConfig = {
    method: 'GET',
    source: 'cdnJson',
    type: 'cdnJson',
    path: FORBIDDEN_CDN_URL,
    isAuth: false,
    underlizeQuery: false,
  };
  return slugRequest<IMossOperationItem[]>(config);
}

// note: 战域 --- 禁区 --热门攻略
export function fetchForbiddenHotData() {
  const config: ApiTypes.HttpRequestConfig = {
    method: 'GET',
    source: 'cdnJson',
    type: 'cdnJson',
    path: FORBIDDEN_HOT_CDN_URL,
    isAuth: false,
    underlizeQuery: false,
  };
  return slugRequest<IMossOperationItem[]>(config);
}

// note: 战域 --- 恶魔岛
export function fetchEvilData() {
  const config: ApiTypes.HttpRequestConfig = {
    method: 'GET',
    source: 'cdnJson',
    type: 'cdnJson',
    path: EVIL_CDN_URL,
    isAuth: false,
    underlizeQuery: false,
  };
  return slugRequest<IMossOperationItem[]>(config);
}

// note: 战域 --- 恶魔岛--热门攻略
export function fetchEvilHotData() {
  const config: ApiTypes.HttpRequestConfig = {
    method: 'GET',
    source: 'cdnJson',
    type: 'cdnJson',
    path: EVIL_HOT_CDN_URL,
    isAuth: false,
    underlizeQuery: false,
  };
  return slugRequest<IMossOperationItem[]>(config);
}

// note: 武器枪匠 --- 热门 -- 攻略
export function fetchFireadrmsHotGunData() {
  const config: ApiTypes.HttpRequestConfig = {
    method: 'GET',
    source: 'cdnJson',
    type: 'cdnJson',
    path: FIREADRMS_HOT_GUN_CDN_URL,
    isAuth: false,
    underlizeQuery: false,
  };
  return slugRequest<IMossOperationItem[]>(config);
}

// note: 武器枪匠 --- 热门 -- 攻略
export function fetchFireadrmsHotData() {
  const config: ApiTypes.HttpRequestConfig = {
    method: 'GET',
    source: 'cdnJson',
    type: 'cdnJson',
    path: FIREADRMS_HOT_CDN_URL,
    isAuth: false,
    underlizeQuery: false,
  };
  return slugRequest<IMossOperationItem[]>(config);
}

// note: 武器枪匠 --- 枪匠 -- 攻略
export function fetchFireadrmsGunHotData() {
  const config: ApiTypes.HttpRequestConfig = {
    method: 'GET',
    source: 'cdnJson',
    type: 'cdnJson',
    path: FIREADRMS_GUN_CDN_URL,
    isAuth: false,
    underlizeQuery: false,
  };
  return slugRequest<IMossOperationItem[]>(config);
}

// note: 武器枪匠 --- 枪匠 -- 属性详解
export function fetchFireadrmsGunPropsData() {
  const config: ApiTypes.HttpRequestConfig = {
    method: 'GET',
    source: 'cdnJson',
    type: 'cdnJson',
    path: FIREADRMS_GUN_PORPS_CDN_URL,
    isAuth: false,
    underlizeQuery: false,
  };
  return slugRequest<IMossOperationItem[]>(config);
}

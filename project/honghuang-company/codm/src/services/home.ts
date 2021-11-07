import { slugRequest } from '@tencent/slug-request';
import { HOME_BANNER_URL, HOME_QUICK_ENTRY_URL, WALKTHROUGH_LABEL_ENTRY_URL } from '../config';

// note:swiper 轮播
export function getSwiperAdList() {
  const config: ApiTypes.HttpRequestConfig = {
    method: 'GET',
    source: 'cdnJson',
    type: 'cdnJson',
    path: HOME_BANNER_URL,
    isAuth: false,
    underlizeQuery: false,
  };
  return slugRequest<IMossOperationItem[]>(config);
}


// note: 首页快捷入口配置
export function getQuickEntryConfig() {
  const config: ApiTypes.HttpRequestConfig = {
    method: 'GET',
    source: 'cdnJson',
    type: 'cdnJson',
    path: HOME_QUICK_ENTRY_URL,
    isAuth: false,
    underlizeQuery: false,
  };
  return slugRequest<IMossOperationItem[]>(config);
}


// note: 首页大神宝典配置
export function getLabelConfig() {
  const config: ApiTypes.HttpRequestConfig = {
    method: 'GET',
    source: 'cdnJson',
    type: 'cdnJson',
    path: WALKTHROUGH_LABEL_ENTRY_URL,
    isAuth: false,
    underlizeQuery: false,
  };
  return slugRequest<IMossOperationItem[]>(config);
}


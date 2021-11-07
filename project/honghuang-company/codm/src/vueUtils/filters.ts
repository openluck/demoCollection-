import { storage } from '@/helpers/storage';
import { formatDate, toHttps, parseSearch, searchBatchAppend } from '@tencent/slug-function-vue';

export const timeFormat = (value: string, format = 'MM月dd日') => formatDate(value, format, {});

export const convertHttps = (url: string) => {
  if (!url) {
    return '';
  }
  return toHttps(url).href;
};

export const clipV4Image = (url: string, w: number, h: number) => {
  const u = convertHttps(url);
  const origin = u.split('?')[0];
  return `${origin}?width=${w}&height=${h}`;
};

export const plat = (platid: number) => {
  let plat = '';
  plat = platid === 1 ? 'Android' : 'IOS';
  return plat;
};

export const area = (areaid: number) => {
  let area = '';
  area = areaid === 1 ? '微信' : 'QQ';
  return area;
};

export const addLoginAuthParams = (url: string) => {
  const { authMap } = storage.getBySession(['authMap']);
  let query = {};
  if (url.includes('?')) {
    query = parseSearch(url) as any;
  }
  query = Object.assign(query, authMap);
  return searchBatchAppend(query, url).href;
};

export const convertDealTypeToText = (dealType: 1 | 2 | 3) => {
  switch (dealType) {
    case 1:
      return '+';
    case 2:
      return '-';
    case 3:
      return '+';
  }
};

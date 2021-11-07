import { slugConsole, isSlugSDK } from '@tencent/slug-function-vue';
import { storage } from '@helpers/storage';

export function getAccountType(): 'qq' | 'wx' | null {
  const { authMap } = storage.getBySession(['authMap']);
  if (authMap) {
    const { areaid } = authMap;
    let area: 'qq' | 'wx' | null = null;
    if (areaid === '2') {
      area = 'qq';
    } else if (areaid === '1') {
      area = 'wx';
    } else if (areaid === '1212') {
      area = 'wx';
    } else if (areaid === '1211') {
      area = 'qq';
    }
    slugConsole.debug(`获取到账号类型: ${area}`);
    return area;
  }
  return null;
}

/**
 * 将对象键值对中的 key 转换为按照驼峰方式命名的 key
 * @param obj
 */
export function camelize(obj: object): { [key: string]: any } | null {
  if (obj === null || obj === undefined) {
    return null;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => camelize(item));
  }
  if (typeof obj === 'object') {
    const out: any = {};
    for (const key in obj as any) {
      const v = (obj as any)[key];
      out[camelizeKey(key)] = camelize(v);
    }
    return out;
  }
  return obj;
}

/**
 * 将key字符串转换成驼峰方式命名（如 "someName"） 的字符串
 * @param key string类型
 * @param separators key分隔符 "-"中划线/"_"下划线
 */
export function camelizeKey(key: string, separators: string[] = ['-', '_']): string {
  const out: any = [];
  let i = 0;
  const separatorsSet = new Set(separators);
  while (i < key.length) {
    if (separatorsSet.has(key[i])) {
      out.push(key[i + 1].toUpperCase());
      i++;
    } else {
      out.push(key[i]);
    }
    i++;
  }
  return out.join('');
}

/**
 * 生成URL链接
 * @param path URL中的路径
 * @param queryArgs URL中 “?” 后面的参数
 */
export function genApiUrl(path: string, queryArgs: object | null): string {
  if (!queryArgs) {
    queryArgs = {};
  }
  const args: string[] = [];
  for (const key in queryArgs as any) {
    const v = (queryArgs as any)[key];
    if (v !== null) {
      args.push(`${key}=${v}`);
    }
  }
  if (args.length === 0) {
    return path;
  }
  return `${path}?${args.join('&')}`;
}

export function checkIsSlugSdk() {
  return isSlugSDK;
}

// 处理灰度策略的逻
export function getCurrentDateString() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  return `${y}-${m}-${d}`;
}

export function reportGrayLevelData() {
  (window as any).PTTSendClick('btn', 'gray_user', '灰度用户');
}

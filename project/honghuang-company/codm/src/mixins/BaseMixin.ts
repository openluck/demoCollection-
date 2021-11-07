import { Component } from 'vue-property-decorator';
import BaseVue from '@helpers/BaseVue';
import { queryBatchAppend } from '@tencent/slug-function-vue';

type BaseRef = { [key: string]: Element };

interface EmitType {
  [key: string]: any[] | any;
}

@Component
class BaseMixin<R extends BaseRef = {}, E extends EmitType = {}> extends BaseVue<R, E> {
  public parserUrl(url: string, query?: { [key: string]: string }) {
    if (url.startsWith('http')) {
      return url;
    }
    const search = queryBatchAppend(query).search;
    return `${url}${search}`;
  }
}

export default BaseMixin;

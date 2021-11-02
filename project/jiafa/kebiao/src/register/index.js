/*
 * @Desc:
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-08-26 10:20:47
 * @LastEditors: went
 * @LastEditTime: 2021-08-26 11:09:40
 */
import registerAntd from "./register-antdv";
import registerApi from "./register-api";
import registerComponents from "./register-components";
export function registerApp(vue) {
  registerAntd(vue);
  registerApi(vue);
  registerComponents(vue);
}

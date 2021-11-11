/*
 * @Desc: 
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-06-02 10:18:06
 * @LastEditors: went
 * @LastEditTime: 2021-07-02 13:22:40
 */
module.exports = {
  presets: [
    [
      '@vue/app',
      {
        useBuiltIns: 'entry',
        polyfills: ['es6.promise', 'es6.symbol']
      }
    ]
  ],
  plugins: [
    ["import", { libraryName: "ant-design-vue", libraryDirectory: "es", style: true }] // `style: true` 会加载 less 文件
  ]
};

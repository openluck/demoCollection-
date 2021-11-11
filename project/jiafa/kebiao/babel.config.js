/*
 * @Descripttion:
 * @version:
 * @Author: YanQY
 * @Date: 2021-08-02 15:27:48
 * @LastEditors: went
 * @LastEditTime: 2021-09-22 11:43:35
 */
const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')
}
module.exports = {
  // presets: ["@vue/cli-plugin-babel/preset"],
  presets: [
    ['@vue/app', {
      useBuiltIns: 'entry'
    }]
  ],
  plugins: [
    [
      "import",
      { libraryName: "ant-design-vue", libraryDirectory: "es", style: true },
      ...prodPlugins
    ] // `style: true` 会加载 less 文件
  ]
};
